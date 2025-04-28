import React, { useState, useEffect } from 'react'
import { ShoppingCart, Minus, Plus, Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCartStore } from '@/store/carStore.mjs'

export default function CartDropdown() {
  const { cartItems, totalItems, addToCart, removeFromCart } = useCartStore()
  const [products, setProducts] = useState([])
  const [total, setTotal] = useState(0)
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchProducts = async () => {
      const productIds = Object.keys(cartItems)
      if (productIds.length === 0) {
        setProducts([])
        return
      }

      try {
        const response = await fetch(`${API_URL}/api/products`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        if (Array.isArray(data.data)) {
          const cartProducts = data.data.filter(product => productIds.includes(product.id))
          setProducts(cartProducts)
        } else {
          console.error('Unexpected data format:', data)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching cart products:', error)
        setProducts([])
      }
    }

    fetchProducts()
  }, [cartItems, API_URL])

  useEffect(() => {
    if (Array.isArray(products) && products.length > 0) {
      const newTotal = products.reduce((sum, product) => {
        const quantity = cartItems[product.id] || 0
        return sum + (product.price * quantity)
      }, 0)
      setTotal(newTotal)
    } else {
      setTotal(0)
    }
  }, [products, cartItems])

  const handleAddToCart = (productId) => {
    addToCart(productId)
  }

  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId)
  }

  const generateWhatsAppMessage = () => {
    let message = "Hola, me gustaría realizar el siguiente pedido:\n\n"
    
    products.forEach(product => {
      const quantity = cartItems[product.id]
      if (quantity > 0) {
        message += `• ${quantity}x ${product.productName} - $${(product.price * quantity).toFixed(2)}\n`
      }
    })
    
    message += `\nTotal: $${total.toFixed(2)}`
    
    return encodeURIComponent(message)
  }

  const handleWhatsAppOrder = () => {
    const message = generateWhatsAppMessage()
    const whatsappUrl = `https://api.whatsapp.com/send/?phone=584121988407&text=${message}&type=phone_number&app_absent=0`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="default" className="relative">
          <ShoppingCart className="h-6 w-6" />
          <span className="sr-only">Carrito</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>Carrito</SheetTitle>
        </SheetHeader>
        <div className="mt-8 h-full flex flex-col">
          {totalItems === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-4">
              <div className="rounded-full border-2 border-gray-200 p-4">
                <ShoppingCart className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium">Tu carrito esta vacio</p>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-16 h-16">
                        <img
                          src={`${API_URL}${product.urlPhoto}` || '/placeholder.svg?height=64&width=64'}
                          alt={product.productName}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{product.productName}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleRemoveFromCart(product.id)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{cartItems[product.id]}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleAddToCart(product.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t mt-4 pt-4 space-y-4">
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 " onClick={handleWhatsAppOrder} >
                  <Send className="h-4 w-4" />
                  Ordenar por WhatsApp
                </Button>
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
                  onClick={handleWhatsAppOrder}
                >
                  <Send className="h-4 w-4" />
                  Ordenar por WhatsApp
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
