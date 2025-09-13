'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { AdvancedPostEditor } from '@/components/admin/advanced-post-editor';
import { notFound } from 'next/navigation';
import { BlogPost } from '@/types/blog';

interface Post extends Omit<BlogPost, 'publishedAt' | 'createdAt' | 'updatedAt' | 'authorId'> {
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  authorId?: string;
}

export default function EditBlogPostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts/${slug}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          notFound();
        }
        throw new Error('Ошибка загрузки поста');
      }

      const postData: Post = await response.json();
      setPost(postData);
    } catch (error) {
      console.error('Error fetching post:', error);
      setError('Ошибка загрузки поста');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ошибка</h1>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return <AdvancedPostEditor initialData={post} isEditing />;
}