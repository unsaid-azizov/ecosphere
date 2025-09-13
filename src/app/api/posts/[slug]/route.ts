import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostStatus } from '@prisma/client';

// GET /api/posts/[slug] - получить пост по slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }

    // Если пост не опубликован и пользователь не админ
    if (post.status !== PostStatus.PUBLISHED && !isAdmin) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }

    // Увеличиваем счетчик просмотров для опубликованных постов
    if (post.status === PostStatus.PUBLISHED) {
      await prisma.post.update({
        where: { slug },
        data: {
          views: {
            increment: 1
          }
        }
      });
      
      post.views += 1;
    }

    return NextResponse.json(post);

  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json(
      { error: 'Ошибка получения поста' },
      { status: 500 }
    );
  }
}

// PUT /api/posts/[slug] - обновить пост (только админы)
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const { slug } = params;
    const body = await request.json();

    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }

    const {
      title,
      excerpt,
      content,
      contentType,
      blocks,
      coverImage,
      images,
      status,
      featured,
      category,
      tags,
      metaTitle,
      metaDescription
    } = body;

    // Если статус меняется на PUBLISHED и publishedAt не установлен
    let publishedAt = existingPost.publishedAt;
    if (status === PostStatus.PUBLISHED && !publishedAt) {
      publishedAt = new Date();
    }

    const post = await prisma.post.update({
      where: { slug },
      data: {
        title,
        excerpt,
        content,
        contentType,
        blocks,
        coverImage,
        images,
        status,
        featured,
        category,
        tags,
        metaTitle,
        metaDescription,
        publishedAt
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(post);

  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: 'Ошибка обновления поста' },
      { status: 500 }
    );
  }
}

// DELETE /api/posts/[slug] - удалить пост (только админы)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const { slug } = params;

    const existingPost = await prisma.post.findUnique({
      where: { slug }
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: 'Пост не найден' },
        { status: 404 }
      );
    }

    await prisma.post.delete({
      where: { slug }
    });

    return NextResponse.json({ message: 'Пост удален' });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { error: 'Ошибка удаления поста' },
      { status: 500 }
    );
  }
}