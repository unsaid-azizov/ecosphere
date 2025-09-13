export interface ContentBlock {
  id: string;
  type: 'text' | 'image' | 'quote' | 'code' | 'heading' | 'list';
  data: any;
}

export interface TextBlock extends ContentBlock {
  type: 'text';
  data: {
    content: string; // Markdown текст
  };
}

export interface ImageBlock extends ContentBlock {
  type: 'image';
  data: {
    url: string;
    alt: string;
    caption?: string;
    width?: number;
    height?: number;
  };
}

export interface QuoteBlock extends ContentBlock {
  type: 'quote';
  data: {
    text: string;
    author?: string;
  };
}

export interface CodeBlock extends ContentBlock {
  type: 'code';
  data: {
    code: string;
    language?: string;
  };
}

export interface HeadingBlock extends ContentBlock {
  type: 'heading';
  data: {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
  };
}

export interface ListBlock extends ContentBlock {
  type: 'list';
  data: {
    items: string[];
    ordered: boolean;
  };
}

export type AnyBlock = TextBlock | ImageBlock | QuoteBlock | CodeBlock | HeadingBlock | ListBlock;

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string; // Markdown для обратной совместимости
  contentType: 'markdown' | 'blocks';
  blocks?: AnyBlock[]; // Новая блочная структура
  coverImage?: string;
  images: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  featured: boolean;
  category?: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
    email: string;
  };
}