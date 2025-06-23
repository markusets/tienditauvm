import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, User, Menu, Loader2 } from 'lucide-react'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Toggle } from "@/components/ui/toggle"
import { Card, CardContent } from "@/components/ui/card"

import { useDebounce } from '@/hooks/use-debounce.mjs'
import { useToast } from '@/hooks/use-toast.mjs'
import { useCartStore } from '@/store/carStore.mjs'
import CartDropdown from '@/components/marketing/CarDropdown'

export default function ModernNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)
  const searchRef = useRef(null)
  const { totalItems, addToCart } = useCartStore() 
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const navigate = useNavigate()

  const handleAuthClick = () => {
    navigate('/auth')
  }

  const handleProductClick = (product) => {
    addToCart(product.id) 
    toast({
      title: 'Producto agregado al carrito',
      description: `${product.productName} ha sido agregado al carrito.`,
      variant: "success",
      style: { backgroundColor: '#88BD2D', color: '#ffffff' },
    })
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const searchProducts = async () => {
      if (debouncedSearchTerm) {
        setIsLoading(true)
        try {
          const response = await fetch(`${API_URL}/api/products/name/${debouncedSearchTerm}`)

          if (response.status === 404) {
            toast({
              title: 'No hay resultados para la búsqueda',
              description: 'Intenta con otra palabra clave',
              variant: "destructive",
            })
            return
          }

          const data = await response.json()
          setSearchResults(data.data)
          setIsSearchOpen(true)

        } catch (error) {
          console.error('Error searching products:', error)
          toast({
            title: 'Error al buscar productos',
            description: 'Por favor, intenta de nuevo más tarde',
            variant: "destructive",
          })
          setSearchResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setSearchResults([])
        setIsSearchOpen(false)
      }
    }

    searchProducts()
  }, [debouncedSearchTerm])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <nav className="bg-black shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="font-bold text-2xl text-[#88BD2D]">UVM</span>
          </div>

          <div className="hidden sm:flex sm:items-center justify-center flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
            <div className="w-full">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm"
                  placeholder="Buscar productos"
                  type="search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            {isSearchOpen && (
              <Card className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-auto z-10">
                <CardContent className="p-2">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductClick(product)} 
                      >
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center p-2">Sin productos encontrados</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="hidden sm:flex sm:items-center">
            <Button variant="link" onClick={handleAuthClick} >
              <User className="h-6 w-6 bg-white" />
              <span className="ml-2 text-white">Sesion de Administración</span>
            </Button>
            <CartDropdown />
          </div>

          <div className="-mr-2 flex items-center sm:hidden bg-black">
            <Toggle className="bg-white"
              variant="default"
              pressed={isMenuOpen}
              onPressedChange={setIsMenuOpen}
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Toggle>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <div className="relative mb-3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 text-sm"
                placeholder="Buscar productos"
                type="search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            {isSearchOpen && (
              <Card className="mb-3">
                <CardContent className="p-2">
                  {isLoading ? (
                    <div className="flex justify-center items-center p-4">
                      <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleProductClick(product)} 
                      >
                        <p className="font-medium">{product.productName}</p>
                        <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center p-2">Sin productos encontrados</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            <div className="flex items-center px-5">
              <Button variant="default" onClick={handleAuthClick} >
                <User className="h-6 w-6 bg-black" />
                <span className="ml-2 text-white">Sesion de Administración</span>
              </Button>

              <CartDropdown />
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
