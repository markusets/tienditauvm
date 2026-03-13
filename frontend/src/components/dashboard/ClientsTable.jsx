import { useState, useEffect } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast.mjs";

// ==================== FORMULARIO CLIENTE ====================

const ClientForm = ({ client, onSubmit }) => {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (client) {
      setFormData({
        cedula: client.cedula || '',
        nombre: client.nombre || '',
        apellido: client.apellido || '',
      });
    }
  }, [client]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.cedula || !formData.nombre || !formData.apellido) {
      toast({
        title: "Campos Requeridos",
        description: "Debes introducir todos los campos para continuar",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cedula">Cedula de Identidad</Label>
        <Input
          id="cedula"
          name="cedula"
          value={formData.cedula}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {client ? 'Actualizar Cliente' : 'Crear Cliente'}
      </Button>
    </form>
  );
};

// ==================== FORMULARIO TRANSACCION ====================

const TransactionForm = ({ transaction, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });
  const { toast } = useToast();

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount || '',
        description: transaction.description || '',
        date: transaction.date ? new Date(transaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
    }
  }, [transaction]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.amount === '' || !formData.description || !formData.date) {
      toast({
        title: "Campos Requeridos",
        description: "Debes introducir todos los campos para continuar",
        variant: "destructive",
      });
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="amount">Monto (positivo = abono, negativo = deuda)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          step="0.01"
          value={formData.amount}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripcion</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Fecha</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          required
        />
      </div>
      <Button type="submit" className="w-full">
        {transaction ? 'Actualizar Transaccion' : 'Registrar Transaccion'}
      </Button>
    </form>
  );
};

// ==================== PANEL DE TRANSACCIONES ====================

const TransactionsPanel = ({ clientId, clientName, onBalanceChange }) => {
  const [transactions, setTransactions] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    if (clientId) fetchTransactions();
  }, [clientId]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${clientId}/transactions`, { headers });
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo cargar las transacciones",
        variant: "destructive",
      });
    }
  };

  const createTransaction = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${clientId}/transactions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
      toast({
        title: "Hecho!",
        description: "Transaccion registrada con exito!",
      });
      fetchTransactions();
      onBalanceChange();
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo crear la transaccion",
        variant: "destructive",
      });
    }
  };

  const updateTransaction = async (transactionId, formData) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${clientId}/transactions/${transactionId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to update transaction');
      toast({
        title: "Hecho!",
        description: "Transaccion actualizada con exito!",
      });
      fetchTransactions();
      onBalanceChange();
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo actualizar la transaccion",
        variant: "destructive",
      });
    }
  };

  const deleteTransaction = async (transactionId) => {
    if (!confirm('Estas seguro de eliminar esta transaccion?')) return;
    try {
      const response = await fetch(`${API_URL}/api/clients/${clientId}/transactions/${transactionId}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error('Failed to delete transaction');
      toast({
        title: "Hecho",
        description: "Transaccion eliminada con exito!",
      });
      fetchTransactions();
      onBalanceChange();
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo eliminar la transaccion",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Transacciones de {clientName}</h3>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Transaccion
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nueva Transaccion</DialogTitle>
            </DialogHeader>
            <TransactionForm onSubmit={createTransaction} />
          </DialogContent>
        </Dialog>
      </div>

      {transactions.length === 0 ? (
        <p className="text-muted-foreground text-center py-4">No hay transacciones registradas</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Descripcion</TableHead>
                <TableHead>Monto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell className={Number(t.amount) < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                    {Number(t.amount) >= 0 ? '+$' : '-$'}{Math.abs(Number(t.amount)).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setSelectedTransaction(t);
                          setIsEditOpen(true);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTransaction(t.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Transaccion</DialogTitle>
          </DialogHeader>
          <TransactionForm
            transaction={selectedTransaction}
            onSubmit={(formData) => updateTransaction(selectedTransaction.id, formData)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// ==================== TABLA PRINCIPAL DE CLIENTES ====================

export default function ClientsTable() {
  const [clients, setClients] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const { toast } = useToast();
  const API_URL = import.meta.env.VITE_PUBLIC_BACKEND_URL;

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients`, { headers });
      if (!response.ok) throw new Error('Failed to fetch clients');
      const data = await response.json();
      setClients(data.data || []);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo cargar los clientes",
        variant: "destructive",
      });
    }
  };

  const createClient = async (formData) => {
    try {
      const response = await fetch(`${API_URL}/api/clients`, {
        method: 'POST',
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create client');
      }
      toast({
        title: "Hecho!",
        description: "Cliente creado con exito!",
      });
      fetchClients();
      setIsCreateOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: error.message || "No se pudo crear el cliente",
        variant: "destructive",
      });
    }
  };

  const updateClient = async (id, formData) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update client');
      }
      toast({
        title: "Hecho!",
        description: "Cliente actualizado con exito!",
      });
      fetchClients();
      setIsEditOpen(false);
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: error.message || "No se pudo actualizar el cliente",
        variant: "destructive",
      });
    }
  };

  const deleteClient = async (id) => {
    if (!confirm('Estas seguro de eliminar este cliente? Se eliminaran todas sus transacciones.')) return;
    try {
      const response = await fetch(`${API_URL}/api/clients/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error('Failed to delete client');
      toast({
        title: "Hecho",
        description: "Cliente eliminado con exito!",
      });
      fetchClients();
    } catch (error) {
      toast({
        title: "Opps! Tenemos un Problema!",
        description: "No se pudo eliminar el cliente",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clientes Tiendita UVM</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Cliente</DialogTitle>
            </DialogHeader>
            <ClientForm onSubmit={createClient} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cedula</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Apellido</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.cedula}</TableCell>
                <TableCell>{client.nombre}</TableCell>
                <TableCell>{client.apellido}</TableCell>
                <TableCell className={Number(client.balance) < 0 ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                  {Number(client.balance) >= 0 ? '+$' : '-$'}{Math.abs(Number(client.balance)).toFixed(2)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsViewOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedClient(client);
                        setIsEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteClient(client.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialog editar cliente */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Cliente</DialogTitle>
          </DialogHeader>
          <ClientForm
            client={selectedClient}
            onSubmit={(formData) => updateClient(selectedClient.id, formData)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog ver transacciones del cliente */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Cliente: {selectedClient?.nombre} {selectedClient?.apellido} - Cedula: {selectedClient?.cedula}
            </DialogTitle>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/40">
                <div>
                  <span className="text-sm text-muted-foreground">Balance Actual</span>
                  <p className={`text-2xl font-bold ${Number(selectedClient.balance) < 0 ? 'text-red-600' : 'text-green-600'}`}>
                    {Number(selectedClient.balance) >= 0 ? '+$' : '-$'}{Math.abs(Number(selectedClient.balance)).toFixed(2)}
                  </p>
                </div>
              </div>
              <TransactionsPanel
                clientId={selectedClient.id}
                clientName={`${selectedClient.nombre} ${selectedClient.apellido}`}
                onBalanceChange={fetchClients}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
