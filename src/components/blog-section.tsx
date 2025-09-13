'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  Calendar, 
  Eye, 
  ArrowRight,
  BookOpen,
  Tag
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  views: number;
  publishedAt: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export function BlogSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/posts?limit=3');
      
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error fetching recent posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading || posts.length === 0) {
    return null; // Не показываем блок если нет постов
  }

  return (
    <section className="relative py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={staggerContainer}
        >
          {/* Header */}
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-lime-500" />
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-forest-800 via-forest-600 to-lime-500 bg-clip-text text-transparent">
                Полезные статьи
              </h2>
            </div>
            <p className="text-xl text-forest-600 max-w-3xl mx-auto leading-relaxed">
              Актуальные новости, советы и инсайты из мира профессиональной химии и HoReCa бизнеса
            </p>
          </motion.div>

          {/* Posts Grid */}
          <motion.div
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
          >
            {posts.map((post) => (
              <motion.article
                key={post.id}
                variants={fadeInUp}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="backdrop-blur-sm bg-white/60 border border-white/60 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    {post.coverImage && (
                      <div className="aspect-video bg-forest-100 rounded-xl mb-4 overflow-hidden">
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    
                    <div className="flex-1 flex flex-col">
                      {post.category && (
                        <div className="flex items-center gap-2 mb-3">
                          <Tag className="w-4 h-4 text-lime-500" />
                          <span className="text-sm font-medium text-lime-600 bg-lime-100 px-2 py-1 rounded-full">
                            {post.category}
                          </span>
                        </div>
                      )}

                      <h3 className="text-xl font-bold text-forest-800 mb-3 group-hover:text-lime-600 transition-colors duration-200 line-clamp-2">
                        {post.title}
                      </h3>

                      {post.excerpt && (
                        <p className="text-forest-600 leading-relaxed mb-4 flex-1 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-sm text-forest-500 pt-4 border-t border-forest-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{post.views}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* CTA to Blog */}
          <motion.div variants={fadeInUp} className="text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-lime-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-lime-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Читать все статьи
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}