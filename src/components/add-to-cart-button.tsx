'use client'

import { useState, useEffect } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Product } from '@/types/product'
import { addToGuestCart, getGuestCart } from '@/lib/guest-cart'
import { toast } from 'sonner'

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  fullWidth?: boolean
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = '',
  size = 'default',
  variant = 'default',
  fullWidth = false
}: AddToCartButtonProps) {
  const { data: session } = useSession()
  const { addToCart, isInCart, getItemQuantity } = useCart()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [guestCartQuantity, setGuestCartQuantity] = useState(0)
  const [forceUpdate, setForceUpdate] = useState(0)

  // Check guest cart for non-logged users
  useEffect(() => {
    if (!session?.user) {
      const guestCart = getGuestCart()
      const item = guestCart.find(item => item.productId === product.id)
      setGuestCartQuantity(item?.quantity || 0)
    }
  }, [product.id, session, forceUpdate])

  const inCart = session?.user ? isInCart(product.id) : guestCartQuantity > 0
  const cartQuantity = session?.user ? getItemQuantity(product.id) : guestCartQuantity

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!isAddingToCart) {
      setIsAddingToCart(true)

      if (session?.user) {
        // Logged in user - use API
        await addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          article: product.article,
          category: product.category
        }, quantity)
      } else {
        // Guest user - use localStorage
        addToGuestCart(product.id, quantity)
        toast.success('Добавлено в корзину')
        setForceUpdate(prev => prev + 1)
      }

      setTimeout(() => {
        setIsAddingToCart(false)
      }, 500)
    }
  }

  const cartButton = (
    <Button
      size={size}
      variant={variant}
      disabled={isAddingToCart}
      className={cn(
        "transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02]",
        fullWidth && "w-full",
        inCart
          ? "bg-forest-600 hover:bg-forest-700 text-white"
          : "bg-lime-400 hover:bg-lime-500 text-forest-800",
        className
      )}
      onClick={handleAddToCart}
    >
      {isAddingToCart ? (
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
      ) : inCart ? (
        <Check className="w-4 h-4 mr-2" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      {inCart ? `В корзине (${cartQuantity})` : 'В корзину'}
    </Button>
  )

  return cartButton
}
