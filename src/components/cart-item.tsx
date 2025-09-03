'use client';

import { useState, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { CartItem as CartItemType } from '@/types/cart';
import { cn } from '@/lib/utils';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const CartItem = memo(function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [editingItem, setEditingItem] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleQuantityInputSubmit = () => {
    const numValue = parseInt(inputValue);
    
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateQuantity(item.id, numValue);
    }
    
    setEditingItem(false);
    setInputValue('');
  };

  const quickSetQuantity = (quantity: number) => {
    onUpdateQuantity(item.id, quantity);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="relative w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={item.product.images[0] || '/placeholder-image.svg'}
              alt={item.product.name}
              fill
              className="object-contain"
              sizes="80px"
            />
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <Link 
                  href={`/product/${item.product.id}`}
                  className="block group"
                >
                  <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer">
                    {item.product.name}
                  </h3>
                </Link>
                <Badge variant="outline" className="text-xs mb-2">
                  {item.product.article}
                </Badge>
                <p className="text-sm text-gray-600">
                  {item.product.category}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(item.id)}
                className="text-gray-400 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Quantity Controls */}
            <div className="space-y-3">
              {/* Quick quantity buttons */}
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-600 self-center mr-2">Быстрый выбор:</span>
                {[5, 25, 100].map((qty) => (
                  <Button
                    key={qty}
                    variant="outline"
                    size="sm"
                    onClick={() => quickSetQuantity(qty)}
                    className={cn(
                      "h-7 px-3 text-xs",
                      item.quantity === qty && "bg-gray-900 text-white hover:bg-gray-800"
                    )}
                  >
                    {qty}
                  </Button>
                ))}
              </div>

              {/* Quantity input and controls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8 p-0"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  
                  {editingItem ? (
                    <Input
                      type="number"
                      min="1"
                      value={inputValue || item.quantity.toString()}
                      onChange={(e) => setInputValue(e.target.value)}
                      onBlur={handleQuantityInputSubmit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleQuantityInputSubmit();
                        } else if (e.key === 'Escape') {
                          setEditingItem(false);
                          setInputValue('');
                        }
                      }}
                      className="w-16 h-8 text-center text-sm"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => {
                        setEditingItem(true);
                        setInputValue(item.quantity.toString());
                      }}
                      className="w-16 h-8 text-center text-sm font-medium hover:bg-gray-50 border border-gray-200 rounded-md transition-colors"
                    >
                      {item.quantity}
                    </button>
                  )}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    className="h-8 w-8 p-0"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    ₽{(item.product.price * item.quantity).toLocaleString()}
                  </div>
                  {item.quantity > 1 && (
                    <div className="text-xs text-gray-600">
                      ₽{item.product.price.toLocaleString()} за шт.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});