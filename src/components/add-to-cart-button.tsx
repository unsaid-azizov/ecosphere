'use client'

import { useState } from 'react'
import { ShoppingCart, Check, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/cart-context'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { LoginDialog } from '@/components/auth/login-dialog'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Product } from '@/types/product'

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
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const inCart = isInCart(product.id)
  const cartQuantity = getItemQuantity(product.id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()

    if (!session?.user) {
      setShowLoginDialog(true)
      return
    }

    if (!isAddingToCart) {
      setIsAddingToCart(true)
      await addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        images: product.images,
        article: product.article,
        category: product.category
      }, quantity)

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

  if (!session?.user && showLoginDialog) {
    return (
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogTrigger asChild>
          {cartButton}
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
              Для добавления товаров в корзину необходимо войти в аккаунт
            </p>
            <LoginDialog />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return cartButton
}
