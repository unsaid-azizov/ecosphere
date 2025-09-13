import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PostStatus } from '@prisma/client';

// GET /api/posts - получить все опубликованные посты
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const featured = searchParams.get('featured') === 'true';
    const status = searchParams.get('status') as PostStatus;

    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';

    // Базовые условия фильтрации
    const where: any = {};
    
    // Если не админ, показывать только опубликованные посты
    if (!isAdmin) {
      where.status = PostStatus.PUBLISHED;
    } else if (status) {
      where.status = status;
    }

    if (category) {
      where.category = category;
    }

    if (featured) {
      where.featured = true;
    }

    const skip = (page - 1) * limit;

    // Получаем посты с пагинацией
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          publishedAt: 'desc'
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
      }),
      prisma.post.count({ where })
    ]);

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { error: 'Ошибка получения постов' },
      { status: 500 }
    );
  }
}

// POST /api/posts - создать новый пост (только админы)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      contentType = 'markdown',
      blocks,
      coverImage,
      images = [],
      status = PostStatus.DRAFT,
      featured = false,
      category,
      tags = [],
      metaTitle,
      metaDescription
    } = body;

    // Проверяем обязательные поля
    if (!title || !content) {
      return NextResponse.json(
        { error: 'Заголовок и содержание обязательны' },
        { status: 400 }
      );
    }

    // Генерируем slug если не указан
    let postSlug = slug;
    if (!postSlug) {
      postSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      // Добавляем timestamp для уникальности
      postSlug += `-${Date.now()}`;
    }

    // Проверяем уникальность slug
    const existingPost = await prisma.post.findUnique({
      where: { slug: postSlug }
    });

    if (existingPost) {
      return NextResponse.json(
        { error: 'Пост с таким slug уже существует' },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        slug: postSlug,
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
        publishedAt: status === PostStatus.PUBLISHED ? new Date() : null,
        authorId: session.user.id
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

    return NextResponse.json(post, { status: 201 });

  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Ошибка создания поста' },
      { status: 500 }
    );
  }
}