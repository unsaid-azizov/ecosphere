'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import { 
  Calendar, 
  Eye, 
  Clock, 
  ArrowRight,
  Tag,
  Search
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  category: string | null;
  tags: string[];
  views: number;
  publishedAt: string;
  author: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
}

interface BlogResponse {
  posts: Post[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
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

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<BlogResponse['pagination'] | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, selectedCategory]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });
      
      if (selectedCategory) {
        params.append('category', selectedCategory);
      }

      const response = await fetch(`/api/posts?${params}`);
      const data: BlogResponse = await response.json();
      
      setPosts(data.posts);
      setPagination(data.pagination);

      // Собираем уникальные категории
      const uniqueCategories = [...new Set(data.posts.map(post => post.category).filter(Boolean))] as string[];
      setCategories(uniqueCategories);
      
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

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
        <motion.div
          initial={{ opacity: 0, rotate: 0 }}
          animate={{ opacity: 0.03, rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-gradient-to-r from-forest-200 to-sage-200 rounded-lg rotate-45"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-24 pb-8 px-4">
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-5xl md:text-6xl font-black bg-gradient-to-r from-forest-800 via-forest-600 to-lime-500 bg-clip-text text-transparent mb-6 leading-tight"
            >
              Блог ЭкоСферы
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl md:text-2xl text-forest-700 max-w-3xl mx-auto leading-relaxed font-light mb-12"
            >
              Актуальные новости, советы по использованию профессиональной химии и инсайты из мира HoReCa
            </motion.p>

            {/* Search and Filters */}
            <motion.div
              variants={fadeInUp}
              className="max-w-2xl mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-forest-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Поиск по статьям..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-forest-200 rounded-xl bg-white/80 backdrop-blur-sm focus:outline-none focus:border-lime-500 focus:ring-2 focus:ring-lime-500/20 transition-all duration-200"
                />
              </div>

              {/* Categories */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-6 justify-center">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      !selectedCategory 
                        ? 'bg-lime-500 text-white' 
                        : 'bg-white/60 text-forest-600 hover:bg-lime-100'
                    }`}
                  >
                    Все
                  </button>
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                        selectedCategory === category 
                          ? 'bg-lime-500 text-white' 
                          : 'bg-white/60 text-forest-600 hover:bg-lime-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="relative py-8 px-4">
        <div className="container mx-auto max-w-7xl">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white/60 rounded-2xl p-6 shadow-lg">
                    <div className="h-48 bg-forest-200 rounded-xl mb-4"></div>
                    <div className="h-4 bg-forest-200 rounded mb-2"></div>
                    <div className="h-4 bg-forest-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-forest-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post.id}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="backdrop-blur-sm bg-white/60 border border-white/60 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                        {post.coverImage && (
                          <div className="aspect-video bg-forest-100 rounded-xl mb-3 overflow-hidden">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        
                        <div className="flex-1 flex flex-col">
                          {post.category && (
                            <div className="flex items-center gap-2 mb-2">
                              <Tag className="w-4 h-4 text-lime-500" />
                              <span className="text-sm font-medium text-lime-600 bg-lime-100 px-2 py-1 rounded-full">
                                {post.category}
                              </span>
                            </div>
                          )}

                          <h2 className="text-xl font-bold text-forest-800 mb-2 group-hover:text-lime-600 transition-colors duration-200 line-clamp-2">
                            {post.title}
                          </h2>

                          {post.excerpt && (
                            <p className="text-forest-600 leading-relaxed mb-3 flex-1 line-clamp-3">
                              {post.excerpt}
                            </p>
                          )}

                          <div className="flex items-center justify-between text-sm text-forest-500 pt-3 border-t border-forest-100">
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

              {/* No posts found */}
              {filteredPosts.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="text-forest-400 mb-4">
                    <Search className="w-16 h-16 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-bold text-forest-600 mb-2">Статьи не найдены</h3>
                  <p className="text-forest-500">Попробуйте изменить параметры поиска</p>
                </motion.div>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-center mt-12 gap-2"
                >
                  {[...Array(pagination.pages)].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          currentPage === page
                            ? 'bg-lime-500 text-white'
                            : 'bg-white/60 text-forest-600 hover:bg-lime-100'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}