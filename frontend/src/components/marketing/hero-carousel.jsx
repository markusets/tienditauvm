import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      id: 1,
      title: "ESTAMPADO UVM",
      subtitle: "Personalización y calidad en cada prenda",
      image: "foto1.webp?height=600&width=1200",
    },
    {
      id: 2,
      title: "ENTREGA CON IDENTIDAD",
      subtitle: "Recibe tu prenda personalizada",
      image: "foto2.webp?height=600&width=1200",
    },
    {
      id: 3,
      title: "DETALLES QUE UNEN",
      subtitle: "Sorprende con artículos UVM exclusivos",
      image: "foto3.webp?height=600&width=1200",
    },
    {
      id: 4,
      title: "TAZAS PERSONALIZADAS",
      subtitle: "Luce tu identidad con estilo",
      image: "foto4.webp?height=600&width=1200",
    },
    {
      id: 5,
      title: "ORGANIZA TUS IDEAS",
      subtitle: "Creatividad UVM contigo",
      image: "foto5.webp?height=600&width=1200",
    },
    {
      id: 6,
      title: "FRANELAS",
      subtitle: "Lleva tu estilo UVM a todas partes",
      image: "foto6.webp?height=600&width=1200",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Logo */}
      <div className="absolute top-4 left-4 z-20">
        <span className="font-bold text-2xl text-[#88BD2D]">UVM</span>
      </div>

      {/* Slides */}
      <div className="relative h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="object-cover w-screen h-full"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h2 className="text-5xl font-bold mb-4">{slide.title}</h2>
              <p className="text-xl">{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full z-10"
        onClick={nextSlide}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  )
}
