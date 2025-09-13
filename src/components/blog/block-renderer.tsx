'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { AnyBlock, BlogPost } from '@/types/blog';

interface BlockRendererProps {
  post: BlogPost;
}

export function BlockRenderer({ post }: BlockRendererProps) {
  if (post.contentType === 'markdown') {
    return (
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    );
  }

  if (post.contentType === 'blocks' && post.blocks) {
    return (
      <div className="space-y-6">
        {post.blocks.map((block, index) => (
          <BlockComponent key={`${block.type}-${index}`} block={block} />
        ))}
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <div className="whitespace-pre-wrap">{post.content}</div>
    </div>
  );
}

interface BlockComponentProps {
  block: AnyBlock;
}

function BlockComponent({ block }: BlockComponentProps) {
  switch (block.type) {
    case 'text':
      return (
        <div className="prose prose-lg max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
          >
            {block.data.content}
          </ReactMarkdown>
        </div>
      );

    case 'heading':
      const HeadingTag = `h${block.data.level}` as keyof JSX.IntrinsicElements;
      const sizeClasses = {
        1: 'text-4xl font-bold',
        2: 'text-3xl font-bold',
        3: 'text-2xl font-bold',
        4: 'text-xl font-bold',
        5: 'text-lg font-bold',
        6: 'text-base font-bold',
      };
      
      return (
        <HeadingTag className={`${sizeClasses[block.data.level as keyof typeof sizeClasses]} text-gray-900 mb-4`}>
          {block.data.text}
        </HeadingTag>
      );

    case 'image':
      return (
        <figure className="my-8">
          <img
            src={block.data.url}
            alt={block.data.alt}
            className="w-full h-auto rounded-lg shadow-lg"
          />
          {block.data.caption && (
            <figcaption className="text-center text-gray-600 text-sm mt-2 italic">
              {block.data.caption}
            </figcaption>
          )}
        </figure>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-lime-500 pl-6 py-4 my-6 bg-gray-50 rounded-r-lg">
          <div className="prose prose-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {block.data.text}
            </ReactMarkdown>
          </div>
          {block.data.author && (
            <cite className="block text-right text-gray-600 text-sm mt-2 not-italic">
              — {block.data.author}
            </cite>
          )}
        </blockquote>
      );

    case 'code':
      return (
        <div className="my-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${block.data.language || 'text'}`}>
              {block.data.code}
            </code>
          </pre>
        </div>
      );

    case 'list':
      const ListTag = block.data.ordered ? 'ol' : 'ul';
      const listClasses = block.data.ordered 
        ? 'list-decimal list-inside space-y-2' 
        : 'list-disc list-inside space-y-2';

      return (
        <ListTag className={`my-4 ${listClasses}`}>
          {block.data.items.map((item, index) => (
            <li key={index} className="text-gray-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw, rehypeSanitize]}
                components={{
                  p: ({ children }) => <span>{children}</span>
                }}
              >
                {item}
              </ReactMarkdown>
            </li>
          ))}
        </ListTag>
      );

    default:
      return null;
  }
}