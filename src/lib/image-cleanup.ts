import fs from 'fs'
import path from 'path'

/**
 * Утилита для очистки неиспользуемых изображений
 */
export class ImageCleanup {
  private static uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products')

  /**
   * Удаляет изображения товара при удалении товара
   */
  static async deleteProductImages(imageUrls: string[]): Promise<void> {
    for (const imageUrl of imageUrls) {
      try {
        // Проверяем, что это локальное изображение (не внешняя ссылка)
        if (imageUrl.startsWith('/uploads/products/')) {
          const fileName = path.basename(imageUrl)
          const filePath = path.join(this.uploadsDir, fileName)
          
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
            console.log(`Deleted image: ${fileName}`)
          }
        }
      } catch (error) {
        console.error(`Error deleting image ${imageUrl}:`, error)
      }
    }
  }

  /**
   * Удаляет старые изображения при обновлении товара
   */
  static async cleanupOldImages(oldImages: string[], newImages: string[]): Promise<void> {
    const imagesToDelete = oldImages.filter(img => !newImages.includes(img))
    await this.deleteProductImages(imagesToDelete)
  }

  /**
   * Очищает все неиспользуемые изображения в папке uploads
   * ВНИМАНИЕ: Используйте осторожно, может удалить изображения, которые еще используются
   */
  static async cleanupUnusedImages(): Promise<{ deleted: number, errors: string[] }> {
    const errors: string[] = []
    let deletedCount = 0

    try {
      if (!fs.existsSync(this.uploadsDir)) {
        return { deleted: 0, errors: [] }
      }

      const files = fs.readdirSync(this.uploadsDir)
      
      for (const file of files) {
        try {
          const filePath = path.join(this.uploadsDir, file)
          const stat = fs.statSync(filePath)
          
          // Удаляем файлы старше 30 дней, которые не используются
          const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
          
          if (stat.mtime.getTime() < thirtyDaysAgo) {
            fs.unlinkSync(filePath)
            deletedCount++
            console.log(`Deleted old unused image: ${file}`)
          }
        } catch (error) {
          errors.push(`Error processing ${file}: ${error}`)
        }
      }
    } catch (error) {
      errors.push(`Error accessing uploads directory: ${error}`)
    }

    return { deleted: deletedCount, errors }
  }

  /**
   * Получает размер папки uploads
   */
  static getUploadsSize(): { size: number, files: number } {
    try {
      if (!fs.existsSync(this.uploadsDir)) {
        return { size: 0, files: 0 }
      }

      let totalSize = 0
      let fileCount = 0

      const files = fs.readdirSync(this.uploadsDir)
      
      for (const file of files) {
        const filePath = path.join(this.uploadsDir, file)
        const stat = fs.statSync(filePath)
        
        if (stat.isFile()) {
          totalSize += stat.size
          fileCount++
        }
      }

      return { size: totalSize, files: fileCount }
    } catch (error) {
      console.error('Error getting uploads size:', error)
      return { size: 0, files: 0 }
    }
  }
}

