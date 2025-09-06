'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface FavoritesContextType {
  favorites: string[]
  addToFavorites: (productId: string) => Promise<void>
  removeFromFavorites: (productId: string) => Promise<void>
  isFavorite: (productId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  // Загружаем избранные товары при входе пользователя
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      loadFavorites()
    } else if (status === 'unauthenticated') {
      setFavorites([])
    }
  }, [session, status])

  const loadFavorites = async () => {
    if (!session?.user) return

    setLoading(true)
    try {
      const response = await fetch('/api/favorites')
      if (response.ok) {
        const favoriteIds = await response.json()
        setFavorites(favoriteIds)
      }
    } catch (error) {
      console.error('Ошибка загрузки избранных:', error)
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = async (productId: string) => {
    if (!session?.user) {
      throw new Error('Требуется авторизация')
    }

    // Оптимистичное обновление - сразу добавляем в UI
    setFavorites(prev => [...prev, productId])

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })

      if (!response.ok) {
        // Если ошибка, откатываем изменение
        setFavorites(prev => prev.filter(id => id !== productId))
        const error = await response.json()
        throw new Error(error.error || 'Ошибка добавления в избранное')
      }
    } catch (error) {
      console.error('Ошибка добавления в избранное:', error)
      // Если ошибка сети, также откатываем
      setFavorites(prev => prev.filter(id => id !== productId))
      throw error
    }
  }

  const removeFromFavorites = async (productId: string) => {
    if (!session?.user) {
      throw new Error('Требуется авторизация')
    }

    // Оптимистичное обновление - сразу удаляем из UI
    const previousFavorites = favorites
    setFavorites(prev => prev.filter(id => id !== productId))

    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        // Если ошибка, возвращаем обратно
        setFavorites(previousFavorites)
        const error = await response.json()
        throw new Error(error.error || 'Ошибка удаления из избранного')
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error)
      // Если ошибка сети, также возвращаем обратно
      setFavorites(previousFavorites)
      throw error
    }
  }

  const isFavorite = (productId: string) => {
    return favorites.includes(productId)
  }

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        loading,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}