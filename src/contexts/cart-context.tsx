'use client';

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { CartItem, Cart, CartContextType } from '@/types/cart';
import { toast } from 'sonner';
// Убрали импорт data-client, будем получать товары через API

// Cart reducer actions
type CartAction =
  | { type: 'SET_CART'; payload: Cart }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_LOADING'; payload: boolean };

interface CartState extends Cart {
  loading: boolean;
  syncing: boolean;
}

const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  loading: false,
  syncing: false,
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: action.payload.items,
        totalItems: action.payload.totalItems,
        totalPrice: action.payload.totalPrice,
        loading: false,
      };
      
    case 'ADD_ITEM': {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      let newItems;
      
      if (existingIndex >= 0) {
        newItems = [...state.items];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + action.payload.quantity
        };
      } else {
        newItems = [...state.items, action.payload];
      }
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    }
    
    case 'UPDATE_ITEM': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id ? action.payload : item
      );
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    }
    
    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload.productId);
      
      return {
        ...state,
        items: newItems,
        totalItems: newItems.reduce((sum, item) => sum + item.quantity, 0),
        totalPrice: newItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        totalItems: 0,
        totalPrice: 0,
      };
      
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
      
    default:
      return state;
  }
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Загружаем корзину из базы данных при входе пользователя
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      loadCartFromServer();
    } else if (status === 'unauthenticated') {
      // Очищаем корзину для неавторизованных пользователей
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [session, status]);

  const loadCartFromServer = async () => {
    if (!session?.user) return;
    
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const response = await fetch('/api/cart');
      if (response.ok) {
        const cartItems = await response.json();
        
        // Загружаем информацию о товарах для каждого элемента корзины
        const items: CartItem[] = [];
        for (const dbItem of cartItems) {
          try {
            const productResponse = await fetch(`/api/products/${dbItem.productId}`);
            if (productResponse.ok) {
              const product = await productResponse.json();
              items.push({
                id: dbItem.productId,
                product,
                quantity: dbItem.quantity,
                addedAt: new Date(dbItem.createdAt),
              });
            }
          } catch (error) {
            console.error(`Ошибка загрузки товара ${dbItem.productId}:`, error);
          }
        }
        
        const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
        
        dispatch({
          type: 'SET_CART',
          payload: { items, totalItems, totalPrice }
        });
      }
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };


  const syncWithServer = async (action: string, data: any) => {
    if (!session?.user) return;
    
    try {
      const response = await fetch('/api/cart', {
        method: action === 'add' ? 'POST' : action === 'update' ? 'PUT' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        console.error('Ошибка синхронизации с сервером');
      }
    } catch (error) {
      console.error('Ошибка сети при синхронизации:', error);
    }
  };

  const addToCart = async (productOrId: string | any, quantity: number = 1) => {
    // Требуем авторизацию для добавления в корзину
    if (!session?.user) {
      throw new Error('Требуется авторизация');
    }

    try {
      let product;
      let productId;

      // Если передан объект товара, используем его
      if (typeof productOrId === 'object' && productOrId.id) {
        product = productOrId;
        productId = productOrId.id;
      }
      // Если передана строка (ID), загружаем товар через API
      else if (typeof productOrId === 'string') {
        productId = productOrId;
        const response = await fetch(`/api/products/${productId}`);
        if (!response.ok) {
          if (response.status === 404) {
            console.error('Товар не найден:', productId);
            return;
          }
          throw new Error('Не удалось загрузить информацию о товаре');
        }
        product = await response.json();
      } else {
        console.error('Неверный формат данных товара');
        return;
      }

    const cartItem: CartItem = {
      id: productId,
      product,
      quantity,
      addedAt: new Date(),
    };

      dispatch({ type: 'ADD_ITEM', payload: cartItem });

      // Показываем тост с информацией о добавлении
      toast.success(`${product.name} добавлен в корзину`, {
        description: `Количество: ${quantity} шт.`,
        duration: 2500,
      });

      // Синхронизируем с сервером
      await syncWithServer('add', { productId, quantity });
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
      if (!(error instanceof Error && error.message.includes('Требуется авторизация'))) {
        toast.error('Не удалось добавить товар в корзину', {
          description: 'Попробуйте еще раз',
        });
      }
      throw error;
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    const existingItem = state.items.find(item => item.id === productId);
    if (!existingItem) return;

    const updatedItem = { ...existingItem, quantity };
    dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });

    // Синхронизируем с сервером
    if (session?.user) {
      await syncWithServer('update', { productId, quantity });
    }
  };

  const removeFromCart = async (productId: string) => {
    // Получаем название товара перед удалением
    const item = state.items.find(item => item.id === productId);
    const productName = item?.product?.name || 'Товар';

    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

    // Показываем тост об удалении
    toast.info(`${productName} удален из корзины`, {
      duration: 2000,
    });

    // Синхронизируем с сервером
    if (session?.user) {
      await syncWithServer('delete', { productId });
    }
  };

  const clearCart = async () => {
    dispatch({ type: 'CLEAR_CART' });

    // Синхронизируем с сервером
    if (session?.user) {
      await syncWithServer('delete', {});
    }
  };

  const isInCart = (productId: string) => {
    return state.items.some(item => item.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = state.items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  const value: CartContextType = {
    cart: {
      items: state.items,
      totalItems: state.totalItems,
      totalPrice: state.totalPrice,
    },
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};