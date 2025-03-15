import { Facebook, Instagram, Twitter, Youtube, MessageCircle } from "lucide-react"

const footerLinks = [
  {
    title: "Universidad",
    links: ["Historia", "Identidad", "Estructura Universitaria", "Curriculo", "integral", "Normativas", "Gente UVM", "Validación internacional"],
  },
  {
    title: "Shop",
    links: ["Find a store", "Gift cards", "Shipping information", "Sale exclusions", "Custom uniforms", "Reconsidered"],
  },
  {
    title: "About Us",
    links: ["Our purpose", "Responsible leadership", "Careers", "The TRACK at New Balance", "Press box", "Medical Plan Information"],
  },
  {
    title: "For You",
    links: ["Special discounts", "Idea submission", "Affiliate program", "Counterfeit products", "Accessibility statement"],
  },
]

export default function Footer() {
  return (
    <footer className="bg-gray-100 pt-16 pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h3 className="font-semibold text-gray-900 mb-4">{column.title}</h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-gray-900">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
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
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Privacy Policy</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">Terms & Conditions</a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-900">CA Supply Chains Act</a>
          </div>
          <p className="text-gray-500">&copy; 2024 Sofia & Juan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
