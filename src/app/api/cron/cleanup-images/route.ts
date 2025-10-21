import { NextRequest, NextResponse } from 'next/server'
import { ImageCleanup } from '@/lib/image-cleanup'

/**
 * Автоматическая очистка изображений по расписанию
 * Вызывается каждые 24 часа через cron job или внешний сервис
 */
export async function GET(request: NextRequest) {
  try {
    // Проверяем секретный ключ для безопасности
    const authHeader = request.headers.get('authorization')
    const secretKey = process.env.CLEANUP_SECRET_KEY || 'default-cleanup-key'
    
    if (authHeader !== `Bearer ${secretKey}`) {
      return NextResponse.json(
        { error: 'Неавторизованный доступ' },
        { status: 401 }
      )
    }

    console.log('Starting automatic image cleanup...')
    
    // Очищаем неиспользуемые изображения
    const result = await ImageCleanup.cleanupUnusedImages()
    
    // Получаем информацию о размере папки uploads
    const uploadsInfo = ImageCleanup.getUploadsSize()

    console.log(`Cleanup completed. Deleted: ${result.deleted} files`)

    return NextResponse.json({
      success: true,
      message: `Автоматическая очистка завершена. Удалено файлов: ${result.deleted}`,
      deleted: result.deleted,
      errors: result.errors,
      uploadsInfo: {
        size: uploadsInfo.size,
        files: uploadsInfo.files,
        sizeFormatted: formatBytes(uploadsInfo.size)
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error in automatic cleanup:', error)
    
    return NextResponse.json(
      { error: 'Ошибка автоматической очистки' },
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
