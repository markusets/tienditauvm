
import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast.mjs"

export default function NewsletterSubscription() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscribeEmail: email }),
      })

      if (response.status === 409) {
        toast({
          title: "¡Ya estás suscrito!",
          description: "Ya estás suscrito a nuestro boletín.",
          variant: "",
        })
      }

      if (response.ok) {
        toast({
          title: "¡Éxito!",
          description: "¡Gracias por suscribirte a nuestro boletín!",
        })
        setEmail('')
      } else {
        throw new Error('Failed to subscribe')
      }
    } catch (error) {
      toast({
        title: "Oops! Algo salió mal",
        description: "Por favor, inténtelo de nuevo más tarde.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="w-full bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-sm">
        <h2 className="text-3xl font-bold mb-2">¿Quiere noticias y actualizaciones de nuestros productos?</h2>
        <p className="text-xl mb-6">Suscríbase a nuestro boletín informativo.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            type="email"
            placeholder="Deja tu correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-grow"
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-[#13953E] hover:bg-[#88BD2D] text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1">
            {isLoading ? 'Subscribiendo...' : 'Subscribete'}
          </Button>
        </form>
      </div>
    </div>
  );
}

