import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"

const footerLinks = []

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="font-bold text-2xl text-[#88BD2D]">La Tiendita UVM</span>
              <p className="mt-2 text-gray-600 max-w-md">
                ✨𝑼𝒏 𝒕𝒐𝒒𝒖𝒆 𝑼𝑽𝑴 𝒆𝒏 𝒄𝒂𝒅𝒂 𝒅𝒆𝒕𝒂𝒍𝒍𝒆...
                👕Materiales POP, franelas, gorras y mucho más...
                🛍️Tienda física y online.
                📦Envíos nacionales
                🌳Identidad uvemista
                📍Sede Estovacuy
              </p>
            </div>
            <div className="flex space-x-6">
              <a href="https://www.instagram.com/latienditauvm" target="_blank"
                rel="noopener noreferrer" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500">&copy; 2025 La Tiendita UVM. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
