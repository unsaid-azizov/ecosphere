'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Image as ImageIcon, AlertCircle, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ImageUploadProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  className?: string
}

export function ImageUpload({ 
  images, 
  onImagesChange, 
  maxImages = 10, 
  className 
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    handleFiles(files)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    handleFiles(files)
  }, [])

  const handleFiles = async (files: File[]) => {
    if (images.length + files.length > maxImages) {
      alert(`Максимальное количество изображений: ${maxImages}`)
      return
    }

    setUploading(true)
    
    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/admin/upload/image', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()
        console.log('Upload response:', response.status, result)

        if (response.ok) {
          onImagesChange([...images, result.imageUrl])
        } else {
          console.error('Upload failed:', result)
          alert(`Ошибка загрузки ${file.name}: ${result.error}`)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
        alert(`Ошибка загрузки ${file.name}`)
      }
    }

    setUploading(false)
    
    // Очищаем input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = async (index: number) => {
    const imageUrl = images[index]
    
    try {
      // Удаляем файл с сервера только если это локальное изображение
      if (imageUrl.startsWith('/uploads/products/')) {
        const response = await fetch(`/api/admin/upload/image?url=${encodeURIComponent(imageUrl)}`, {
          method: 'DELETE',
        })

        if (!response.ok) {
          console.error('Failed to delete image from server')
          // Продолжаем удаление из UI даже если серверная очистка не удалась
        }
      }
    } catch (error) {
      console.error('Error deleting image:', error)
      // Продолжаем удаление из UI даже если произошла ошибка
    }

    // Удаляем из списка
    const newImages = images.filter((_, i) => i !== index)
    onImagesChange(newImages)
  }

  const confirmDelete = (index: number) => {
    setImageToDelete(index)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (imageToDelete !== null) {
      removeImage(imageToDelete)
    }
    setDeleteDialogOpen(false)
    setImageToDelete(null)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Область загрузки */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400',
          uploading && 'pointer-events-none opacity-50'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <>
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-600">Загрузка изображений...</p>
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  Перетащите изображения сюда или нажмите для выбора
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  JPEG, PNG, WebP до 5MB. Максимум {maxImages} изображений
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Скрытый input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />

      {/* Предварительный просмотр изображений */}
      {images.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">
            Загруженные изображения ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((imageUrl, index) => (
              <Card key={index} className="relative group">
                <CardContent className="p-2">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt={`Изображение ${index + 1}`}
                      className="w-full h-24 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.svg'
                      }}
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute -top-2 -right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation()
                        confirmDelete(index)
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Кнопка добавления еще изображений */}
      {images.length < maxImages && !uploading && (
        <Button
          variant="outline"
          onClick={openFileDialog}
          className="w-full"
        >
          <ImageIcon className="w-4 h-4 mr-2" />
          Добавить еще изображения
        </Button>
      )}

      {/* Диалог подтверждения удаления */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить изображение?</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите удалить это изображение? Это действие нельзя отменить.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
            >
              Отмена
            </Button>
            <Button 
              variant="destructive"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
