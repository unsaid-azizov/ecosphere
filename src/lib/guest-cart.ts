// Guest cart utilities for localStorage
export interface GuestCartItem {
  productId: string;
  quantity: number;
}

const GUEST_CART_KEY = 'ecosphere_guest_cart';
const GUEST_FAVORITES_KEY = 'ecosphere_guest_favorites';

// Helper to dispatch custom event for same-tab updates
function dispatchGuestCartUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('guestCartUpdated'));
  }
}

// Cart functions
export function getGuestCart(): GuestCartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(GUEST_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

export function saveGuestCart(cart: GuestCartItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cart));
    dispatchGuestCartUpdate();
  } catch (error) {
    console.error('Failed to save guest cart:', error);
  }
}

export function addToGuestCart(productId: string, quantity: number = 1): void {
  const cart = getGuestCart();
  const existingIndex = cart.findIndex(item => item.productId === productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({ productId, quantity });
  }

  saveGuestCart(cart);
}

export function updateGuestCartItem(productId: string, quantity: number): void {
  const cart = getGuestCart();
  const index = cart.findIndex(item => item.productId === productId);

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = quantity;
    }
    saveGuestCart(cart);
  }
}

export function removeFromGuestCart(productId: string): void {
  const cart = getGuestCart().filter(item => item.productId !== productId);
  saveGuestCart(cart);
}

export function clearGuestCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_CART_KEY);
  dispatchGuestCartUpdate();
}

// Favorites functions
export function getGuestFavorites(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const favorites = localStorage.getItem(GUEST_FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
}

export function saveGuestFavorites(favorites: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(GUEST_FAVORITES_KEY, JSON.stringify(favorites));
    dispatchGuestCartUpdate();
  } catch (error) {
    console.error('Failed to save guest favorites:', error);
  }
}

export function addToGuestFavorites(productId: string): void {
  const favorites = getGuestFavorites();
  if (!favorites.includes(productId)) {
    favorites.push(productId);
    saveGuestFavorites(favorites);
  }
}

export function removeFromGuestFavorites(productId: string): void {
  const favorites = getGuestFavorites().filter(id => id !== productId);
  saveGuestFavorites(favorites);
}

export function isInGuestFavorites(productId: string): boolean {
  return getGuestFavorites().includes(productId);
}

export function clearGuestFavorites(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(GUEST_FAVORITES_KEY);
  dispatchGuestCartUpdate();
}
