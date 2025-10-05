import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/contexts/cart-context";
import { OrdersProvider } from "@/contexts/orders-context";
import { FavoritesProvider } from "@/contexts/favorites-context";
// import { DiscountProvider } from "@/contexts/discount-context"; // ВРЕМЕННО ОТКЛЮЧЕНО
import { SessionProvider } from "@/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";

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
        <SessionProvider>
          <FavoritesProvider>
            <CartProvider>
              <OrdersProvider>
                {children}
                <Toaster />
              </OrdersProvider>
            </CartProvider>
          </FavoritesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}