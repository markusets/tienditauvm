export class ClientResponseDTO {
  id: string;
  cedula: string;
  nombre: string;
  apellido: string;
  balance: number;
}

export class ClientTransactionResponseDTO {
  id: string;
  amount: number;
  description: string;
  date: Date;
  status: string;
}
