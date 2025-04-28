import { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast.mjs"
import { useRoleStore } from "@/store/carStore"
import { ChevronLeft } from 'lucide-react';

export default function AuthForms() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { setRole } = useRoleStore()
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })


  const [signupData, setSignupData] = useState({
    name: '',
    lastname: '',
    email: '',
    password: '',
    acceptTerms: false
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      })

      const data = await response.json()
      const userRole = data.userDataResponse.role;

      if (response.ok) {
        setRole(userRole)
        toast({
          title: `Bienvenido ${data.userDataResponse.name}!`,
          description: `Has iniciado sesión correctamente como usuario role: ${userRole}.`,
        })
        localStorage.setItem('token', data.access_token)
        console.log("local storage", localStorage.getItem('token'))
        navigate('/dashboard');
      }
    }
    catch (error) {
      toast({
        title: "No has colocado datos válidos.",
        description: "Checa tus datos de email password y vuelve a intentar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }


  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: signupData.name,
          lastname: signupData.lastname,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      const data = await response.json();

      if (response.status === 409) {
        toast({
          title: "Ya tienes una cuenta!",
          description: "Este email ya está registrado. Por favor inicia sesión",
          variant: "destructive",
        });
        return;
      }

      if (response.ok) {
        const userRole = data.userDataSent.role;
        setRole(userRole);
        toast({
          title: "Registrado!",
          description: "Tu cuenta ha sido creada exitosamente. Iniciando Sesion",
        });
        localStorage.setItem('token', data.access_token);
        navigate('/dashboard');
      }
    } catch (error) {
      toast({
        title: "Opps! Algo salió mal.",
        description: "No te preocupes, intenta de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-sm p-8">
          {isLogin ? (
            <>
              <Button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full">
                <ChevronLeft size={24} />
              </Button>
              <h1 className="text-2xl font-semibold mb-2">Bienvenido</h1>
              <p className="text-gray-600 mb-6">ingresa tus datos!</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo electrónico"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Iniciando Sesion..." : "Iniciar Sesion"}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-6">
                No tienes una cuenta?{" "}
                <Button variant="link" className="p-0 text-blue-600" onClick={() => setIsLogin(false)}>
                  Registrate
                </Button>
              </p>
            </>
          ) : (
            <>
            <Button onClick={() => navigate('/')} className="absolute top-4 left-4 p-2 bg-gray-800 rounded-full">
                <ChevronLeft size={24} />
              </Button>
              <h1 className="text-2xl font-semibold mb-2">Bienvenido</h1>
              <p className="text-gray-600 mb-6">Ingresa tus datos para el registro</p>
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nombres</Label>
                  <Input
                    id="signup-name"
                    placeholder="Tus nombres"
                    value={signupData.name}
                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-lastname">Apellidos</Label>
                  <Input
                    id="signup-lastname"
                    placeholder="Tus apellidos"
                    value={signupData.lastname}
                    onChange={(e) => setSignupData({ ...signupData, lastname: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Tu email"
                    value={signupData.email}
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupData.password}
                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={signupData.acceptTerms}
                    onCheckedChange={(checked) =>
                      setSignupData({ ...signupData, acceptTerms: checked })
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600"
                  >
                    Acepto las condiciones del servicio
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading || !signupData.acceptTerms}
                >
                  {isLoading ? "Registrandose..." : "Registrarse"}
                </Button>
              </form>
              <p className="text-center text-sm text-gray-600 mt-6">
                Ya tienes una cuenta?{" "}
                <Button variant="link" className="p-0 text-blue-600" onClick={() => setIsLogin(true)}>
                  Inicia sesión
                </Button>
              </p>
            </>
          )}
        </div>
      </div>
      <div className="flex-1 hidden lg:block">
        <img
          src="auth_app.webp?height=1080&width=1080"
          alt="Auth background"
          width={1080}
          height={1080}
          className="h-full w-full object-cover"
        />
      </div>
    </div>
  )
}