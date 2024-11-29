import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

import logo from '@/assets/tiendita-logo-uvm.jpg'

export default function ShoesHero() {
  return (
    <div className="relative bg-gray-100 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-4xl">
                <span className="block xl:inline">¿Ya eres UVEMISTA?</span>{' '}
                <span className="block text-[#88BD2D] xl:inline">Top Collection</span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Cómodo. Transpirable. Versátil.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                <div className="rounded-md shadow">
                  <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 md:py-4 md:text-lg md:px-10">
                    Para Hombres
                  </Button>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-red-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10">
                    Para Damas
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img
          className="h-64 w-full object-cover sm:h-72 md:h-fit md:w-600px lg:w-full lg:h-full"
          src={logo}
          alt="UVM-LOGO"
        />
      </div>
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-green-600 text-white hover:bg-green-700"
          asChild
        >
          <a
            href="https://api.whatsapp.com/send/?phone=584121988407&text&type=phone_number&app_absent=0"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Open WhatsApp</span>
          </a>
        </Button>
      </div>
    </div>
  )
}
