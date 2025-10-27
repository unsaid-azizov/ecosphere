import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

// Максимальный размер файла (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Разрешенные типы файлов
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

// Настройка для Next.js App Router - увеличение лимита body до 10MB
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 30 // максимальное время выполнения 30 секунд

export async function POST(request: NextRequest) {
  try {
    console.log('Image upload request received')
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      console.log('No session found')
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    console.log('Session found for user:', session.user.email)

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      console.log('User not authorized:', currentUser?.role)
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    console.log('User authorized, processing file upload')

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      console.log('No file found in request')
      return NextResponse.json(
        { error: 'Файл не найден' },
        { status: 400 }
      )
    }

    console.log('File received:', file.name, 'Size:', file.size, 'Type:', file.type)

    // Валидация типа файла
    if (!ALLOWED_TYPES.includes(file.type)) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'Неподдерживаемый тип файла. Разрешены: JPEG, PNG, WebP' },
        { status: 400 }
      )
    }

    // Валидация размера файла
    if (file.size > MAX_FILE_SIZE) {
      console.log('File too large:', file.size)
      return NextResponse.json(
        { error: 'Файл слишком большой. Максимальный размер: 5MB' },
        { status: 400 }
      )
    }

    // Создаем папку для загрузок если её нет
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')
    console.log('Uploads directory:', uploadsDir)
    
    if (!fs.existsSync(uploadsDir)) {
      console.log('Creating uploads directory')
      fs.mkdirSync(uploadsDir, { recursive: true })
    }

    // Генерируем уникальное имя файла
    const fileExtension = path.extname(file.name).toLowerCase()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 50)
    const fileName = `${randomUUID()}_${sanitizedName}${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    
    console.log('Saving file to:', filePath)

    // Сохраняем файл
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    fs.writeFileSync(filePath, buffer)
    console.log('File saved successfully')

    // Возвращаем URL изображения
    const imageUrl = `/uploads/products/${fileName}`
    console.log('Returning image URL:', imageUrl)

    return NextResponse.json({
      success: true,
      imageUrl,
      fileName,
      originalName: file.name,
      size: file.size
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE endpoint для удаления изображения
export async function DELETE(request: NextRequest) {
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

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL изображения не указан' },
        { status: 400 }
      )
    }

    // Извлекаем имя файла из URL
    const fileName = path.basename(imageUrl)
    const filePath = path.join(process.cwd(), 'public', 'uploads', 'products', fileName)

    // Проверяем существование файла и удаляем
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    return NextResponse.json({
      success: true,
      message: 'Изображение удалено'
    })

  } catch (error) {
    console.error('Error deleting image:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}
