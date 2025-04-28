import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import { useCartStore } from '@/store/carStore.mjs'

export default function ShoesCollectionTop() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart, cartItems, totalItems } = useCartStore()
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/api/products`)
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data.data)
        setIsLoading(false)
      } catch (err) {
        setError('Tenemos problemas para cargar los productos. Inténtelo de nuevo más tarde.')
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  if (isLoading) {
    return <div className="text-center py-12">cargando...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">Accesorios y ropa modernos  para ti</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden transition-shadow duration-300 ease-in-out hover:shadow-lg">
              <div className="relative">
                <img src={`${API_URL}${product.urlPhoto}`} alt={product.productName} className="w-full h-64 object-cover" />
                <Badge className="absolute top-2 right-2 bg-[#88BD2D]"></Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.productName}</h3>
                <p className="text-gray-600 font-medium">${product.price.toFixed(2)}</p>
                <p className="text-gray-500 mt-2 line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4">
                <Button
                  className="w-full bg-[#13953E] hover:bg-[#88BD2D] text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
                  onClick={() => addToCart(product.id)}
                >
                  Agregar al carrito {cartItems[product.id] ? `(${cartItems[product.id]})` : ''}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
