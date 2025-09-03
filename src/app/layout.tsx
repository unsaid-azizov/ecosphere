import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { OrdersProvider } from "@/contexts/orders-context";

export const metadata: Metadata = {
  title: "ЭкоСфера - Каталог товаров для гостиниц",
  description: "Широкий ассортимент экологичных товаров для гостиничного бизнеса",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="antialiased font-sans">
        <CartProvider>
          <OrdersProvider>
            {children}
          </OrdersProvider>
        </CartProvider>
      </body>
    </html>
  );
}