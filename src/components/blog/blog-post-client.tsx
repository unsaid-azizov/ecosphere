'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import {
  Calendar,
  Eye,
  ArrowLeft,
  Tag,
  Share2,
  User
} from 'lucide-react';
import { BlockRenderer } from '@/components/blog/block-renderer';
import { BlogPost } from '@/types/blog';

interface Post extends BlogPost {
  views: number;
  publishedAt: string;
}

interface BlogPostClientProps {
  post: Post;
  slug: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

export function BlogPostClient({ post, slug }: BlogPostClientProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAuthorName = (author: Post['author']) => {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || 'Автор';
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt || post?.title,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lime-50 relative overflow-hidden">
      <Navbar />

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.04, scale: 1.2 }}
          transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute top-1/4 right-1/3 w-32 h-32 bg-gradient-to-r from-lime-200 to-forest-200 rounded-full"
        />
      </div>

      <article className="relative pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            {/* Back Button */}
            <motion.div variants={fadeInUp} className="mb-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-forest-600 hover:text-lime-600 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                Назад к блогу
              </Link>
            </motion.div>

            {/* Post Header */}
            <motion.header variants={fadeInUp} className="mb-12">
              {post.category && (
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-lime-500" />
                  <span className="text-sm font-medium text-lime-600 bg-lime-100 px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              )}

              <h1 className="text-4xl md:text-5xl font-black text-forest-800 mb-6 leading-tight">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-xl text-forest-600 leading-relaxed mb-8">
                  {post.excerpt}
                </p>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between flex-wrap gap-4 py-6 border-t border-b border-forest-100">
                <div className="flex items-center gap-6 text-sm text-forest-500">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{getAuthorName(post.author)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    <span>{post.views} просмотров</span>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-forest-600 hover:text-lime-600 transition-colors duration-200"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Поделиться</span>
                </button>
              </div>
            </motion.header>

            {/* Cover Image */}
            {post.coverImage && (
              <motion.div variants={fadeInUp} className="mb-12">
                <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            )}

            {/* Post Content */}
            <motion.div
              variants={fadeInUp}
              className="mb-12 text-forest-700"
            >
              <BlockRenderer post={post} />
            </motion.div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <motion.div variants={fadeInUp} className="mb-12">
                <h3 className="text-lg font-semibold text-forest-800 mb-4">Теги:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white/60 text-forest-600 rounded-full text-sm border border-forest-200"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Back to Blog CTA */}
            <motion.div variants={fadeInUp} className="text-center pt-12 border-t border-forest-100">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-lime-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-lime-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Читать другие статьи
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </article>
    </div>
  );
}
