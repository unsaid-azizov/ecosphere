'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { calculatePrice, getDiscountDescription, getDiscountBadgeColor, type PriceResult } from '@/lib/pricing'
import { UserType } from '@prisma/client'

interface ProductPriceProps {
  productId: string
  originalPrice: number
  className?: string
  showSavings?: boolean
}

interface UserDiscountData {
  userDiscount: number
  isVip: boolean
  userType: UserType
  userSpecialPrices: Array<{
    productId: string
    price: number
  }>
  productDiscounts: Array<{
    productId: string
    discountPercent: number
  }>
}

export function ProductPrice({ 
  productId, 
  originalPrice, 
  className = '', 
  showSavings = true 
}: ProductPriceProps) {
  const { data: session } = useSession()
  const [priceData, setPriceData] = useState<PriceResult>({
    originalPrice,
    finalPrice: originalPrice,
    discount: 0,
    discountType: 'none',
    savings: 0
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!session?.user) {
      // Для неавторизованных пользователей показываем обычную цену
      setPriceData({
        originalPrice,
        finalPrice: originalPrice,
        discount: 0,
        discountType: 'none',
        savings: 0
      })
      return
    }

    setLoading(true)

    // ВРЕМЕННО ОТКЛЮЧЕНО: Загрузка скидок вызывает слишком много запросов
    // Показываем оригинальную цену без скидок
    setPriceData({
      originalPrice,
      finalPrice: originalPrice,
      discount: 0,
      discountType: 'none',
      savings: 0
    })
    setLoading(false)
  }, [session, productId, originalPrice])

  if (loading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
      </div>
    )
  }

  const hasDiscount = priceData.discount > 0 && priceData.discountType !== 'none'
  const discountDescription = getDiscountDescription(priceData.discountType, session?.user?.userType as UserType)

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-emerald-600">
          ₽{priceData.finalPrice.toLocaleString()}
        </span>
        
        {hasDiscount && (
          <>
            <span className="text-sm text-gray-500 line-through">
              ₽{priceData.originalPrice.toLocaleString()}
            </span>
            <Badge className={`text-xs ${getDiscountBadgeColor(priceData.discountType)}`}>
              -{priceData.discount}%
            </Badge>
          </>
        )}
      </div>
      
      {hasDiscount && showSavings && (
        <div className="text-xs text-gray-600">
          <div>{discountDescription}</div>
          <div className="text-green-600 font-medium">
            Экономия: ₽{priceData.savings.toLocaleString()}
          </div>
        </div>
      )}
      
      {!session && hasDiscount && (
        <Badge variant="outline" className="text-xs">
          Войдите для получения скидки
        </Badge>
      )}
    </div>
  )
}