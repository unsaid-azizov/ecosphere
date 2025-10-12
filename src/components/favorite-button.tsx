'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFavorites } from '@/contexts/favorites-context'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { addToGuestFavorites, removeFromGuestFavorites, isInGuestFavorites } from '@/lib/guest-cart'
import { toast } from 'sonner'

interface FavoriteButtonProps {
  productId: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function FavoriteButton({ productId, className = '', size = 'md' }: FavoriteButtonProps) {
  const { data: session } = useSession()
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites()
  const [isLoading, setIsLoading] = useState(false)
  const [guestFavorite, setGuestFavorite] = useState(false)

  // Check guest favorites on mount and when productId changes
  useEffect(() => {
    if (!session?.user) {
      setGuestFavorite(isInGuestFavorites(productId))
    }
  }, [productId, session])

  const isInFavorites = session?.user ? isFavorite(productId) : guestFavorite

  const handleToggleFavorite = async () => {
    setIsLoading(true)
    try {
      if (session?.user) {
        // Logged in user - use API
        if (isInFavorites) {
          await removeFromFavorites(productId)
        } else {
          await addToFavorites(productId)
        }
      } else {
        // Guest user - use localStorage
        if (isInFavorites) {
          removeFromGuestFavorites(productId)
          setGuestFavorite(false)
          toast.success('Удалено из избранного')
        } else {
          addToGuestFavorites(productId)
          setGuestFavorite(true)
          toast.success('Добавлено в избранное')
        }
      }
    } catch (error) {
      console.error('Ошибка изменения избранного:', error)
      toast.error('Ошибка при изменении избранного')
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

  return favoriteButton
}