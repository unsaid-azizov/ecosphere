export interface Product {
  id: string;
  article: string;
  name: string;
  description: string;
  price: number;
  categories: string[]; // Множественные категории
  images: string[];
  availability?: string; // Для обратной совместимости
  stockQuantity?: number; // Количество на складе
  isAvailable?: boolean; // Доступность товара
}