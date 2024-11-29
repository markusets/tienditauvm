
import { Button } from "@/components/ui/button"
import { Instagram } from "lucide-react"

export default function InstagramInfo() {
  const images = [
    { src: "IG1_.webp?height=900&width=900", alt: "IG_1" },
    { src: "IG_2.webp?height=900&width=900", alt: "IG_2" },
    { src: "IG_3.webp?height=900&width=900", alt: "IG_3" },
    { src: "IG_4.webp?/height=900&width=900", alt: "IG_4" },
  ]

  return (
    <section className="bg-gray-50 py-12 md:py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="lg:w-1/3 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestro Instagram</h2>
            <p className="text-gray-600 mb-6">
              Síguenos en Instagram y etiquétanos para aparecer en nuestro timeline
            </p>
            <Button className="inline-flex items-center">
              <Instagram className="mr-2 h-4 w-4" />
              @latienditauvm
            </Button>
          </div>
          <div className="lg:w-2/3 grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
