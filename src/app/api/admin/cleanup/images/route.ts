import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImageCleanup } from '@/lib/image-cleanup'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Очищаем неиспользуемые изображения
    const result = await ImageCleanup.cleanupUnusedImages()
    
    // Получаем информацию о размере папки uploads
    const uploadsInfo = ImageCleanup.getUploadsSize()

    return NextResponse.json({
      success: true,
      message: `Очистка завершена. Удалено файлов: ${result.deleted}`,
      deleted: result.deleted,
      errors: result.errors,
      uploadsInfo: {
        size: uploadsInfo.size,
        files: uploadsInfo.files,
        sizeFormatted: formatBytes(uploadsInfo.size)
      }
    })

  } catch (error) {
    console.error('Error cleaning up images:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Получаем информацию о размере папки uploads
    const uploadsInfo = ImageCleanup.getUploadsSize()

    return NextResponse.json({
      uploadsInfo: {
        size: uploadsInfo.size,
        files: uploadsInfo.files,
        sizeFormatted: formatBytes(uploadsInfo.size)
      }
    })

  } catch (error) {
    console.error('Error getting uploads info:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

