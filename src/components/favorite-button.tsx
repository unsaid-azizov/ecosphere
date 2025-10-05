'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/contexts/favorites-context'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LoginDialog } from '@/components/auth/login-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { LogIn } from 'lucide-react'

interface FavoriteButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const [isLoading, setIsLoading] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const isInFavorites = isFavorite(productId)

  const handleToggleFavorite = async () => {
    if (!session?.user) {
      setShowLoginDialog(true)
      return
    }

    setIsLoading(true)
    try {
      if (isInFavorites) {
        await removeFromFavorites(productId)
      } else {
        await addToFavorites(productId)
      }
    } catch (error) {
      console.error('Ошибка изменения избранного:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const favoriteButton = (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'relative p-0 rounded-full transition-all duration-200 hover:scale-110',
        sizeClasses[size],
        isInFavorites
          ? 'text-red-500 hover:text-red-600'
          : 'text-gray-400 hover:text-red-500',
        className
      )}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          isInFavorites ? 'fill-current' : ''
        )}
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={cn(
            'border-2 border-gray-300 border-t-red-500 rounded-full animate-spin',
            iconSizes[size]
          )} />
        </div>
      )}
    </Button>
  )

  if (!session?.user && showLoginDialog) {
    return (
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogTrigger asChild>
          {favoriteButton}
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-emerald-600">
              <LogIn className="w-5 h-5" />
              Вход в аккаунт
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 py-4">
            <p className="text-center text-gray-600">
              Для добавления в избранное необходимо войти в аккаунт
            </p>
            <LoginDialog />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return favoriteButton
}