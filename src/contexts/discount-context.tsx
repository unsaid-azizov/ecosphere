'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { calculateDiscounts, type DiscountCalculationResult } from '@/lib/pricing'

interface DiscountContextType {
  discounts: Map<string, DiscountCalculationResult>
  loading: boolean
  getDiscount: (productId: string, originalPrice: number) => DiscountCalculationResult | null
  refreshDiscounts: (products: Array<{ productId: string; originalPrice: number }>) => Promise<void>
}

const DiscountContext = createContext<DiscountContextType | null>(null)

export function useDiscounts() {
  const context = useContext(DiscountContext)
  if (!context) {
    throw new Error('useDiscounts must be used within a DiscountProvider')
  }
  return context
}

interface DiscountProviderProps {
  children: ReactNode
}

export function DiscountProvider({ children }: DiscountProviderProps) {
  const { data: session } = useSession()
  const [discounts, setDiscounts] = useState<Map<string, DiscountCalculationResult>>(new Map())
  const [loading, setLoading] = useState(false)
  const [requestQueue, setRequestQueue] = useState<Array<{ productId: string; originalPrice: number }>>([])
  const [isProcessing, setIsProcessing] = useState(false)

  const getDiscount = (productId: string, originalPrice: number): DiscountCalculationResult | null => {
    const existing = discounts.get(productId)
    if (existing) {
      return existing
    }
    
    // Add to queue for batch processing
    if (!requestQueue.some(item => item.productId === productId) && session?.user) {
      setRequestQueue(prev => [...prev, { productId, originalPrice }])
    }
    
    return null
  }

  const refreshDiscounts = async (products: Array<{ productId: string; originalPrice: number }>) => {
    if (!session?.user || products.length === 0) return

    setLoading(true)
    try {
      const results = await calculateDiscounts(products)
      const newDiscounts = new Map(discounts)
      
      results.forEach(result => {
        newDiscounts.set(result.productId, result)
      })
      
      setDiscounts(newDiscounts)
    } catch (error) {
      console.error('Ошибка загрузки скидок:', error)
    } finally {
      setLoading(false)
    }
  }

  // Process request queue in batches
  useEffect(() => {
    if (requestQueue.length === 0 || isProcessing || !session?.user) return

    const timer = setTimeout(async () => {
      setIsProcessing(true)
      const currentQueue = [...requestQueue]
      setRequestQueue([])
      
      // Remove already processed items
      const toProcess = currentQueue.filter(item => !discounts.has(item.productId))
      
      if (toProcess.length > 0) {
        await refreshDiscounts(toProcess)
      }
      
      setIsProcessing(false)
    }, 100) // Small delay to batch requests

    return () => clearTimeout(timer)
  }, [requestQueue, isProcessing, session, discounts])

  // Clear discounts when user logs out
  useEffect(() => {
    if (!session?.user) {
      setDiscounts(new Map())
      setRequestQueue([])
    }
  }, [session])

  return (
    <DiscountContext.Provider value={{
      discounts,
      loading,
      getDiscount,
      refreshDiscounts
    }}>
      {children}
    </DiscountContext.Provider>
  )
}