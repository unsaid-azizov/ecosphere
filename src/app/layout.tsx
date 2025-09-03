import type { Metadata } from "next";
import "./globals.css";

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
        {children}
      </body>
    </html>
  );
}