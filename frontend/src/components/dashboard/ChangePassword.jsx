import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, AlertCircle } from "lucide-react";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  // Obtener datos del usuario actual
  const [userData, setUserData] = useState({});
  const token = localStorage.getItem('token');
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    if (token) {
      try {
        const response = await fetch(`${API_URL}/api/profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error obteniendo perfil:', error);
      }
    }
  };

  const validatePassword = (password) => {
    // Validaciones de seguridad
    if (password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula";
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula";
    }
    if (!/(?=.*[0-9])/.test(password)) {
      return "La contraseña debe contener al menos un número";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas nuevas coincidan
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    // Validar fuerza de la contraseña
    const passwordError = validatePassword(formData.newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    try {
      // Método 1: Usar el nuevo endpoint dedicado (más simple y directo)
      const changePasswordResponse = await fetch(`${API_URL}/api/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      });

      if (changePasswordResponse.ok) {
        toast({
          title: "¡Contraseña Actualizada!",
          description: "Tu contraseña ha sido cambiada exitosamente. Por seguridad, debes iniciar sesión nuevamente.",
        });

        // Limpiar el formulario
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });

        // Redirigir al auth después de 2 segundos
        setTimeout(() => {
          localStorage.removeItem('token');
          window.location.href = '/auth';
        }, 2000);

      } else {
        const errorData = await changePasswordResponse.json();
        if (changePasswordResponse.status === 400) {
          setError(errorData.message === 'Current password is incorrect'
            ? 'La contraseña actual es incorrecta'
            : errorData.message);
        } else {
          setError('Error al actualizar la contraseña');
        }
      }

      // Método 2 (RESPALDO): Si el endpoint dedicado no existe, usar el método anterior
      if (changePasswordResponse.status === 404) {
        // Intentar con el método antiguo (login + update)
        const loginResponse = await fetch(`${API_URL}/api/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userData.email,
            password: formData.currentPassword
          })
        });

        if (!loginResponse.ok) {
          setError('La contraseña actual es incorrecta');
          setLoading(false);
          return;
        }

        const loginData = await loginResponse.json();

        // Actualizar usando el endpoint de usuarios
        const updateResponse = await fetch(`${API_URL}/api/users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.access_token}`
          },
          body: JSON.stringify({
            name: userData.name,
            lastname: userData.lastname,
            email: userData.email,
            password: formData.newPassword,
            role: userData.role || 'user'
          })
        });

        if (updateResponse.ok) {
          toast({
            title: "¡Contraseña Actualizada!",
            description: "Tu contraseña ha sido cambiada exitosamente.",
          });

          setFormData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });

          setTimeout(() => {
            localStorage.removeItem('token');
            window.location.href = '/auth';
          }, 2000);
        } else {
          const errorData = await updateResponse.json();
          setError(errorData.message || 'Error al actualizar la contraseña');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Cambiar Contraseña
        </CardTitle>
        <CardDescription>
          Actualiza tu contraseña de administrador. Asegúrate de usar una contraseña fuerte y única.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                disabled={loading}
                placeholder="Ingresa tu contraseña actual"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                disabled={loading}
                placeholder="Ingresa tu nueva contraseña"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Mínimo 8 caracteres, incluye mayúsculas, minúsculas y números
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                disabled={loading}
                placeholder="Confirma tu nueva contraseña"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' })}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Consejos de Seguridad:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• No compartas tu contraseña con nadie</li>
            <li>• Usa una contraseña única para esta cuenta</li>
            <li>• Cambia tu contraseña regularmente</li>
            <li>• Evita usar información personal en tu contraseña</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChangePassword;