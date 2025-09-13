'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  Plus, 
  X,
  Type,
  Image as ImageIcon,
  Quote,
  Code,
  List,
  Hash,
  GripVertical,
  Trash2
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AnyBlock, ContentBlock, BlogPost } from '@/types/blog';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface AdvancedPostEditorProps {
  initialData?: Partial<BlogPost>;
  isEditing?: boolean;
}

const BLOCK_TYPES = [
  { type: 'text', icon: Type, label: 'Текст' },
  { type: 'image', icon: ImageIcon, label: 'Изображение' },
  { type: 'heading', icon: Hash, label: 'Заголовок' },
  { type: 'quote', icon: Quote, label: 'Цитата' },
  { type: 'code', icon: Code, label: 'Код' },
  { type: 'list', icon: List, label: 'Список' }
];

export function AdvancedPostEditor({ initialData, isEditing = false }: AdvancedPostEditorProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [editorMode, setEditorMode] = useState<'markdown' | 'blocks'>('blocks');
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    slug: initialData?.slug || '',
    excerpt: initialData?.excerpt || '',
    content: initialData?.content || '',
    contentType: initialData?.contentType || 'blocks',
    blocks: initialData?.blocks || [createTextBlock()],
    coverImage: initialData?.coverImage || '',
    images: initialData?.images || [],
    status: initialData?.status || 'DRAFT',
    featured: initialData?.featured || false,
    category: initialData?.category || '',
    tags: initialData?.tags || [],
    metaTitle: initialData?.metaTitle || '',
    metaDescription: initialData?.metaDescription || ''
  });

  function createBlock(type: string): AnyBlock {
    const id = `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    switch (type) {
      case 'text':
        return createTextBlock(id);
      case 'image':
        return { id, type: 'image', data: { url: '', alt: '', caption: '' } };
      case 'heading':
        return { id, type: 'heading', data: { text: '', level: 2 } };
      case 'quote':
        return { id, type: 'quote', data: { text: '', author: '' } };
      case 'code':
        return { id, type: 'code', data: { code: '', language: 'javascript' } };
      case 'list':
        return { id, type: 'list', data: { items: [''], ordered: false } };
      default:
        return createTextBlock(id);
    }
  }

  function createTextBlock(id?: string): AnyBlock {
    return {
      id: id || `block_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'text',
      data: { content: '' }
    };
  }

  // Автогенерация slug из заголовка
  useEffect(() => {
    if (!isEditing && formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addBlock = (type: string) => {
    const newBlock = createBlock(type);
    setFormData(prev => ({
      ...prev,
      blocks: [...prev.blocks, newBlock]
    }));
  };

  const updateBlock = (blockId: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.map(block => 
        block.id === blockId ? { ...block, data: { ...block.data, ...data } } : block
      )
    }));
  };

  const deleteBlock = (blockId: string) => {
    setFormData(prev => ({
      ...prev,
      blocks: prev.blocks.filter(block => block.id !== blockId)
    }));
  };

  const moveBlock = (blockId: string, direction: 'up' | 'down') => {
    setFormData(prev => {
      const blocks = [...prev.blocks];
      const index = blocks.findIndex(block => block.id === blockId);
      
      if (direction === 'up' && index > 0) {
        [blocks[index], blocks[index - 1]] = [blocks[index - 1], blocks[index]];
      } else if (direction === 'down' && index < blocks.length - 1) {
        [blocks[index], blocks[index + 1]] = [blocks[index + 1], blocks[index]];
      }
      
      return { ...prev, blocks };
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  // Конвертация блоков в markdown для совместимости
  const blocksToMarkdown = (blocks: AnyBlock[]): string => {
    return blocks.map(block => {
      switch (block.type) {
        case 'text':
          return block.data.content;
        case 'heading':
          return `${'#'.repeat(block.data.level)} ${block.data.text}`;
        case 'image':
          return `![${block.data.alt}](${block.data.url})${block.data.caption ? `\n*${block.data.caption}*` : ''}`;
        case 'quote':
          return `> ${block.data.text}${block.data.author ? `\n> \n> — ${block.data.author}` : ''}`;
        case 'code':
          return `\`\`\`${block.data.language}\n${block.data.code}\n\`\`\``;
        case 'list':
          return block.data.items.map((item, i) => 
            block.data.ordered ? `${i + 1}. ${item}` : `- ${item}`
          ).join('\n');
        default:
          return '';
      }
    }).join('\n\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        contentType: editorMode,
        content: editorMode === 'blocks' ? blocksToMarkdown(formData.blocks) : formData.content,
        blocks: editorMode === 'blocks' ? formData.blocks : null
      };

      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/posts/${initialData?.slug}` : '/api/posts';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения поста');
      }

      router.push('/admin/blog');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Ошибка сохранения поста');
    } finally {
      setLoading(false);
    }
  };

  const renderBlockEditor = (block: AnyBlock) => {
    switch (block.type) {
      case 'text':
        return (
          <div className="space-y-2">
            <Textarea
              value={block.data.content}
              onChange={(e) => updateBlock(block.id, { content: e.target.value })}
              placeholder="Введите текст (поддерживается Markdown)"
              rows={8}
              className="font-mono text-sm"
            />
            {block.data.content && (
              <div className="mt-2 p-3 bg-gray-50 rounded border">
                <div className="text-xs text-gray-500 mb-2">Предпросмотр:</div>
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {block.data.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );

      case 'image':
        return (
          <div className="space-y-3">
            <Input
              placeholder="URL изображения"
              value={block.data.url}
              onChange={(e) => updateBlock(block.id, { url: e.target.value })}
            />
            <Input
              placeholder="Alt текст"
              value={block.data.alt}
              onChange={(e) => updateBlock(block.id, { alt: e.target.value })}
            />
            <Input
              placeholder="Подпись (опционально)"
              value={block.data.caption}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
            />
            {block.data.url && (
              <div className="mt-2">
                <img 
                  src={block.data.url} 
                  alt={block.data.alt} 
                  className="max-w-full h-auto rounded border"
                />
                {block.data.caption && (
                  <p className="text-sm text-gray-600 mt-1 italic">{block.data.caption}</p>
                )}
              </div>
            )}
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-3">
            <Select 
              value={block.data.level.toString()} 
              onValueChange={(value) => updateBlock(block.id, { level: parseInt(value) })}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1,2,3,4,5,6].map(level => (
                  <SelectItem key={level} value={level.toString()}>H{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Текст заголовка"
              value={block.data.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
            />
            {block.data.text && (
              <div className="mt-2">
                {React.createElement(`h${block.data.level}`, {
                  className: `text-${6-block.data.level}xl font-bold text-gray-900`
                }, block.data.text)}
              </div>
            )}
          </div>
        );

      case 'quote':
        return (
          <div className="space-y-3">
            <Textarea
              placeholder="Текст цитаты"
              value={block.data.text}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              rows={3}
            />
            <Input
              placeholder="Автор (опционально)"
              value={block.data.author}
              onChange={(e) => updateBlock(block.id, { author: e.target.value })}
            />
            {block.data.text && (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
                {block.data.text}
                {block.data.author && (
                  <cite className="block mt-2 text-sm">— {block.data.author}</cite>
                )}
              </blockquote>
            )}
          </div>
        );

      case 'code':
        return (
          <div className="space-y-3">
            <Input
              placeholder="Язык программирования"
              value={block.data.language}
              onChange={(e) => updateBlock(block.id, { language: e.target.value })}
            />
            <Textarea
              placeholder="Код"
              value={block.data.code}
              onChange={(e) => updateBlock(block.id, { code: e.target.value })}
              rows={8}
              className="font-mono text-sm"
            />
            {block.data.code && (
              <pre className="bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                <code>{block.data.code}</code>
              </pre>
            )}
          </div>
        );

      default:
        return <div>Неподдерживаемый тип блока</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            type="button" 
            variant="ghost" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isEditing ? 'Редактировать пост' : 'Создать пост'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-4">
            <Label htmlFor="editor-mode" className="text-sm">Редактор:</Label>
            <Select value={editorMode} onValueChange={(value: 'markdown' | 'blocks') => setEditorMode(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blocks">Блоки</SelectItem>
                <SelectItem value="markdown">Markdown</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={loading} className="bg-lime-600 hover:bg-lime-700">
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Основная информация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Заголовок *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Введите заголовок поста"
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">URL (slug)</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="url-friendly-version"
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Краткое описание</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Краткое описание для анонса поста"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Content Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Содержание *</CardTitle>
            </CardHeader>
            <CardContent>
              {editorMode === 'markdown' ? (
                <Textarea
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Введите содержание поста в формате Markdown"
                  rows={20}
                  className="font-mono text-sm"
                  required
                />
              ) : (
                <div className="space-y-4">
                  {formData.blocks.map((block, index) => (
                    <div key={block.id} className="border rounded-lg p-4 relative group">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {BLOCK_TYPES.find(t => t.type === block.type)?.label || block.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveBlock(block.id, 'up')}
                            disabled={index === 0}
                          >
                            ↑
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveBlock(block.id, 'down')}
                            disabled={index === formData.blocks.length - 1}
                          >
                            ↓
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteBlock(block.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      {renderBlockEditor(block)}
                    </div>
                  ))}
                  
                  {/* Add Block Buttons */}
                  <div className="flex flex-wrap gap-2 pt-4">
                    {BLOCK_TYPES.map(blockType => (
                      <Button
                        key={blockType.type}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addBlock(blockType.type)}
                        className="flex items-center gap-2"
                      >
                        <blockType.icon className="w-4 h-4" />
                        {blockType.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Обложка</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="coverImage">URL обложки поста</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => handleInputChange('coverImage', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <Card>
            <CardHeader>
              <CardTitle>Публикация</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Статус</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Черновик</SelectItem>
                    <SelectItem value="PUBLISHED">Опубликован</SelectItem>
                    <SelectItem value="ARCHIVED">Архивирован</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => handleInputChange('featured', checked)}
                />
                <Label htmlFor="featured">Рекомендуемый пост</Label>
              </div>
            </CardContent>
          </Card>

          {/* Category */}
          <Card>
            <CardHeader>
              <CardTitle>Категория</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                placeholder="Введите категорию"
              />
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Теги</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Новый тег"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTag}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}