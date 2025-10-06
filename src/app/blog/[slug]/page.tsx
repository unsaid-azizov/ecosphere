import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { BlogPostClient } from '@/components/blog/blog-post-client';
import { BlogPost } from '@/types/blog';

interface Post extends BlogPost {
  views: number;
  publishedAt: string;
}

interface PageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return {
        title: 'Пост не найден',
      };
    }

    const post: Post = await response.json();

    return {
      title: post.title,
      description: post.excerpt || post.title,
      keywords: post.tags.join(', '),
      authors: [{ name: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        type: 'article',
        publishedTime: post.publishedAt,
        authors: [`${post.author.firstName || ''} ${post.author.lastName || ''}`.trim()],
        images: post.coverImage ? [
          {
            url: post.coverImage,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${slug}`,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: post.coverImage ? [post.coverImage] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Ошибка загрузки поста',
    };
  }
}

// Server Component
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = params;

  let post: Post | null = null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/posts/${slug}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error('Ошибка загрузки поста');
    }

    post = await response.json();
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  if (!post) {
    notFound();
  }

  // Generate JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt || post.title,
    image: post.coverImage || '',
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Автор',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ЭкоСфера',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/logo.png`,
      },
    },
    keywords: post.tags.join(', '),
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Client Component for interactivity */}
      <BlogPostClient post={post} slug={slug} />
    </>
  );
}
