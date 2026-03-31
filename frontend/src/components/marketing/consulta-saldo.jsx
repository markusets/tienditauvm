import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast.mjs';

export default function ConsultaSaldo() {
  const [cedula, setCedula] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cedula.trim()) return;

    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/api/clients/lookup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cedula: cedula.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'No se pudo consultar el saldo');
        return;
      }

      setResult(data.data);
    } catch (err) {
      toast({
        title: 'Error de conexion',
        description: 'No se pudo conectar con el servidor. Intenta de nuevo mas tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const balance = result ? Number(result.balance) : 0;

  return (
    <div className="min-h-[60vh] w-full bg-gray-50 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <h2 className="text-2xl font-bold">Consulta de Saldo</h2>
            <p className="text-sm text-muted-foreground">
              Ingresa tu cedula para consultar tu saldo
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cedula">Cedula de Identidad</Label>
                <Input
                  id="cedula"
                  placeholder="Ej: 12345678"
                  value={cedula}
                  onChange={(e) => {
                    setCedula(e.target.value);
                    setResult(null);
                    setError(null);
                  }}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#13953E] hover:bg-[#0f7a32] text-white"
                disabled={isLoading || !cedula.trim()}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Consultando...' : 'Consultar'}
              </Button>
            </form>

            {result && (
              <div className="mt-6 p-6 rounded-lg bg-muted/40 text-center space-y-2">
                <p className="text-muted-foreground">
                  Hola, <span className="font-semibold text-foreground">{result.nombre}</span>!
                </p>
                <p className="text-sm text-muted-foreground">Tu saldo actual es:</p>
                <p className={`text-3xl font-bold ${balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {balance >= 0 ? '+$' : '-$'}{Math.abs(balance).toFixed(2)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {balance < 0
                    ? 'Tienes un saldo pendiente por pagar'
                    : balance > 0
                      ? 'Tienes saldo a favor'
                      : 'No tienes deudas pendientes'}
                </p>
              </div>
            )}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
