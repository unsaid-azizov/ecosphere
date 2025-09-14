'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  category: string | null;
  views: number;
  publishedAt: string | null;
  createdAt: string;
  author: {
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

const statusConfig = {
  DRAFT: { label: 'Черновик', color: 'bg-gray-100 text-gray-800' },
  PUBLISHED: { label: 'Опубликован', color: 'bg-green-100 text-green-800' },
  ARCHIVED: { label: 'Архивирован', color: 'bg-red-100 text-red-800' }
};

export function BlogManagement() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<BlogResponse['pagination'] | null>(null);

  useEffect(() => {
    fetchPosts();
  }, [currentPage, statusFilter]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20'
      });

      if (statusFilter) {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/posts?${params}`);

      if (!response.ok) {
        throw new Error('Ошибка загрузки постов');
      }

      const data: BlogResponse = await response.json();
      setPosts(data.posts);
      setPagination(data.pagination);

    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      const response = await fetch(`/api/posts/${slug}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Ошибка удаления поста');
      }

      // Обновляем список постов
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Ошибка удаления поста');
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getAuthorName = (author: Post['author']) => {
    return `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.email;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление блогом</h1>
          <p className="text-gray-600 mt-1">Создавайте и управляйте статьями блога</p>
        </div>
        <Link href="/admin/blog/new">
          <Button className="bg-lime-600 hover:bg-lime-700">
            <Plus className="w-4 h-4 mr-2" />
            Создать пост
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск постов..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
        >
          <option value="">Все статусы</option>
          <option value="DRAFT">Черновики</option>
          <option value="PUBLISHED">Опубликованные</option>
          <option value="ARCHIVED">Архивированные</option>
        </select>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-lg border shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-lime-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Загрузка постов...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Заголовок</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Категория</TableHead>
                <TableHead>Автор</TableHead>
                <TableHead>Просмотры</TableHead>
                <TableHead>Дата публикации</TableHead>
                <TableHead>Создан</TableHead>
                <TableHead className="w-[100px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    Посты не найдены
                  </TableCell>
                </TableRow>
              ) : (
                filteredPosts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-gray-900 line-clamp-2">
                          {post.title}
                          {post.featured && (
                            <Badge variant="secondary" className="ml-2 text-xs">
                              Рекомендуемый
                            </Badge>
                          )}
                        </div>
                        {post.excerpt && (
                          <div className="text-sm text-gray-500 line-clamp-1">
                            {post.excerpt}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusConfig[post.status].color}>
                        {statusConfig[post.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.category ? (
                        <Badge variant="outline">{post.category}</Badge>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {getAuthorName(post.author)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(post.publishedAt)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {formatDate(post.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/blog/${post.slug}`}
                              target="_blank"
                              className="flex items-center"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Просмотр
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin/blog/${post.slug}/edit`}
                              className="flex items-center"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Редактировать
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeletePost(post.slug)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t">
            <div className="flex gap-1">
              {[...Array(pagination.pages)].map((_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-lime-600 hover:bg-lime-700" : ""}
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            <div className="text-sm text-gray-500 ml-4">
              Всего: {pagination.total} постов
            </div>
          </div>
        )}
      </div>
    </div>
  );
}