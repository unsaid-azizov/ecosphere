'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Order, OrdersContextType } from '@/types/order';

const OrdersContext = createContext<OrdersContextType | null>(null);

export function OrdersProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('ecosphere-orders');

    if (savedOrders) {
      try {
        const parsedOrders = JSON.parse(savedOrders).map((order: any) => ({
          ...order,
          createdAt: new Date(order.createdAt),
          lastSentAt: order.lastSentAt ? new Date(order.lastSentAt) : undefined
        }));
        setOrders(parsedOrders);
      } catch (error) {
        console.error('Error loading orders from localStorage:', error);
      }
    }

    setIsLoaded(true);
  }, []);

  // Save orders to localStorage whenever orders change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('ecosphere-orders', JSON.stringify(orders));
    }
  }, [orders, isLoaded]);

  const saveOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'sentCount'>): string => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      createdAt: new Date(),
      status: 'draft',
      sentCount: 0
    };

    setOrders(prev => [newOrder, ...prev]);

    return newOrder.id;
  };

  const sendOrder = (orderId: string): boolean => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return false;

    // Format order for email
    const emailBody = formatOrderForEmail(order);
    const subject = encodeURIComponent(`🛒 ${order.sentCount > 0 ? 'Повторный заказ' : 'Новый заказ'} №${order.id} от ${order.customer.contactPerson}`);
    const emailUrl = `mailto:info@ecosphere.su?subject=${subject}&body=${emailBody}`;

    try {
      // Try to open email client
      window.location.href = emailUrl;
      
      // Update order status and sent count
      setOrders(prev => prev.map(o => 
        o.id === orderId 
          ? { 
              ...o, 
              status: 'sent' as const,
              sentCount: o.sentCount + 1,
              lastSentAt: new Date()
            }
          : o
      ));
      return true;
    } catch (error) {
      console.error('Error opening email client:', error);
      return false;
    }
  };

  const getOrder = (orderId: string): Order | undefined => {
    return orders.find(o => o.id === orderId);
  };

  const deleteOrder = (orderId: string): void => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const clearHistory = (): void => {
    setOrders([]);
  };

  const value: OrdersContextType = {
    orders,
    saveOrder,
    sendOrder,
    getOrder,
    deleteOrder,
    clearHistory
  };

  return (
    <OrdersContext.Provider value={value}>
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrdersProvider');
  }
  return context;
}

function formatOrderForEmail(order: Order): string {
  let emailBody = `🛒 ЗАКАЗ №${order.id}`;
  
  if (order.sentCount > 0) {
    emailBody += ` (ПОВТОР #${order.sentCount + 1})`;
  }
  
  emailBody += `%0D%0A%0D%0A`;
  
  // Customer info
  emailBody += `👤 ЗАКАЗЧИК:%0D%0A`;
  emailBody += `Тип: ${getCompanyTypeLabel(order.customer.companyType)}%0D%0A`;
  if (order.customer.companyName) {
    emailBody += `Компания: ${encodeURIComponent(order.customer.companyName)}%0D%0A`;
  }
  if (order.customer.inn) {
    emailBody += `ИНН: ${order.customer.inn}%0D%0A`;
  }
  emailBody += `Контактное лицо: ${encodeURIComponent(order.customer.contactPerson)}%0D%0A`;
  emailBody += `Телефон: ${order.customer.phone}%0D%0A`;
  emailBody += `Email: ${order.customer.email}%0D%0A`;
  if (order.customer.address) {
    emailBody += `Адрес: ${encodeURIComponent(order.customer.address)}%0D%0A`;
  }
  
  // Order items
  emailBody += `%0D%0A📦 ТОВАРЫ (${order.totalItems} шт.):%0D%0A`;
  order.items.forEach((item, index) => {
    emailBody += `${index + 1}. ${encodeURIComponent(item.name)}%0D%0A`;
    emailBody += `   Артикул: ${item.article}%0D%0A`;
    emailBody += `   Ссылка: ${item.productUrl}%0D%0A`;
    emailBody += `   Цена: ₽${item.price.toLocaleString()} × ${item.quantity} шт. = ₽${item.total.toLocaleString()}%0D%0A%0D%0A`;
  });
  
  emailBody += `💰 ИТОГО: ₽${order.totalAmount.toLocaleString()}%0D%0A`;
  
  if (order.customer.comment) {
    emailBody += `%0D%0A💬 КОММЕНТАРИЙ:%0D%0A${encodeURIComponent(order.customer.comment)}%0D%0A`;
  }
  
  emailBody += `%0D%0A📅 Дата создания: ${order.createdAt.toLocaleString('ru-RU')}%0D%0A`;
  
  if (order.lastSentAt) {
    emailBody += `📤 Последняя отправка: ${order.lastSentAt.toLocaleString('ru-RU')}%0D%0A`;
  }
  
  return emailBody;
}

function getCompanyTypeLabel(type: string): string {
  switch (type) {
    case 'individual': return 'Физическое лицо';
    case 'ip': return 'Индивидуальный предприниматель';
    case 'ooo': return 'Общество с ограниченной ответственностью';
    default: return 'Не указано';
  }
}