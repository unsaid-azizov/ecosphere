import { UserType } from '@prisma/client'

interface Product {
  id: string
  price: number
}

interface PriceCalculationParams {
  product: Product
  userType?: UserType | null
  userDiscountPercent?: number
  isVip?: boolean
  specialPrice?: number
  productDiscountPercent?: number
}

interface PriceResult {
  originalPrice: number
  finalPrice: number
  discount: number
  discountType: 'none' | 'user' | 'special' | 'product' | 'vip' | 'business'
  savings: number
}

/**
 * Вычисляет окончательную цену товара с учетом всех скидок
 */
export function calculatePrice(params: PriceCalculationParams): PriceResult {
  const {
    product,
    userType,
    userDiscountPercent = 0,
    isVip = false,
    specialPrice,
    productDiscountPercent = 0
  } = params

  const originalPrice = product.price
  let finalPrice = originalPrice
  let bestDiscount = 0
  let discountType: PriceResult['discountType'] = 'none'

  // 1. Специальная цена для пользователя (приоритет #1)
  if (specialPrice && specialPrice > 0) {
    finalPrice = specialPrice
    bestDiscount = ((originalPrice - specialPrice) / originalPrice) * 100
    discountType = 'special'
  } else {
    // 2. Скидка VIP статуса (приоритет #2)
    let vipDiscount = 0
    if (isVip) {
      vipDiscount = 15 // VIP скидка 15%
    }

    // 3. Скидка по типу пользователя (приоритет #3)
    let businessDiscount = 0
    if (userType === 'IP') {
      businessDiscount = 10 // ИП скидка 10%
    } else if (userType === 'OOO') {
      businessDiscount = 15 // ООО скидка 15%
    }

    // 4. Персональная скидка пользователя (приоритет #4)
    const personalDiscount = userDiscountPercent

    // 5. Скидка на товар (приоритет #5)
    const itemDiscount = productDiscountPercent

    // Выбираем максимальную скидку
    const discounts = [
      { value: vipDiscount, type: 'vip' as const },
      { value: businessDiscount, type: 'business' as const },
      { value: personalDiscount, type: 'user' as const },
      { value: itemDiscount, type: 'product' as const }
    ]

    const bestDiscountOption = discounts.reduce((best, current) => 
      current.value > best.value ? current : best
    )

    if (bestDiscountOption.value > 0) {
      bestDiscount = bestDiscountOption.value
      discountType = bestDiscountOption.type
      finalPrice = originalPrice * (1 - bestDiscount / 100)
    }
  }

  // Округляем до 2 знаков после запятой
  finalPrice = Math.round(finalPrice * 100) / 100
  const savings = originalPrice - finalPrice

  return {
    originalPrice,
    finalPrice,
    discount: Math.round(bestDiscount * 100) / 100,
    discountType,
    savings: Math.round(savings * 100) / 100
  }
}

/**
 * Получает описание типа скидки для отображения пользователю
 */
export function getDiscountDescription(discountType: PriceResult['discountType'], userType?: UserType | null): string {
  switch (discountType) {
    case 'special':
      return 'Специальная цена'
    case 'vip':
      return 'VIP скидка'
    case 'business':
      if (userType === 'IP') return 'Скидка для ИП'
      if (userType === 'OOO') return 'Корпоративная скидка'
      return 'Бизнес скидка'
    case 'user':
      return 'Персональная скидка'
    case 'product':
      return 'Акция на товар'
    case 'none':
    default:
      return ''
  }
}

/**
 * Определяет цвет бейджа скидки для UI
 */
export function getDiscountBadgeColor(discountType: PriceResult['discountType']): string {
  switch (discountType) {
    case 'special':
      return 'bg-purple-100 text-purple-800'
    case 'vip':
      return 'bg-yellow-100 text-yellow-800'
    case 'business':
      return 'bg-blue-100 text-blue-800'
    case 'user':
      return 'bg-green-100 text-green-800'
    case 'product':
      return 'bg-red-100 text-red-800'
    case 'none':
    default:
      return 'bg-gray-100 text-gray-800'
  }
}