import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Блог ЭкоСфера - Полезные статьи о гостиничном бизнесе',
  description: 'Читайте полезные статьи о гостиничном бизнесе, товарах для отелей, экологичных решениях и индустрии гостеприимства',
  keywords: 'блог, гостиничный бизнес, отели, экология, товары для гостиниц',
  openGraph: {
    title: 'Блог ЭкоСфера',
    description: 'Полезные статьи о гостиничном бизнесе и экологичных решениях',
    type: 'website',
    url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://ecosphere.su'}/blog`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Блог ЭкоСфера',
    description: 'Полезные статьи о гостиничном бизнесе и экологичных решениях',
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
