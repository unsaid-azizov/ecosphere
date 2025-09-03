export interface OrderCustomer {
  companyType: 'individual' | 'ip' | 'ooo';
  companyName?: string;
  inn?: string;
  contactPerson: string;
  phone: string;
  email: string;
  address?: string;
  comment?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  article: string;
  price: number;
  quantity: number;
  total: number;
  productUrl: string;
}

export interface Order {
  id: string;
  customer: OrderCustomer;
  items: OrderItem[];
  totalAmount: number;
  totalItems: number;
  createdAt: Date;
  status: 'draft' | 'sent' | 'confirmed' | 'processing' | 'completed';
  sentCount: number; // Количество отправок
  lastSentAt?: Date; // Когда последний раз отправляли
}

export interface OrdersContextType {
  orders: Order[];
  saveOrder: (order: Omit<Order, 'id' | 'createdAt' | 'status' | 'sentCount'>) => string;
  sendOrder: (orderId: string) => boolean;
  getOrder: (orderId: string) => Order | undefined;
  deleteOrder: (orderId: string) => void;
  clearHistory: () => void;
}