import { Request, Response } from 'express';
import * as cache from "memory-cache";
import { initDataSource } from '../db/data.source';
import { ClientEntity } from '../entities/clients.entity';
import { ClientTransactionEntity } from '../entities/client.transactions.entity';
import { ClientResponseDTO, ClientTransactionResponseDTO } from '../dtos/clients.dto';

export class ClientsController {

  private static async recalculateBalance(clientId: string): Promise<number> {
    const transactionRepository = initDataSource.getRepository(ClientTransactionEntity);
    const clientRepository = initDataSource.getRepository(ClientEntity);

    const result = await transactionRepository
      .createQueryBuilder("t")
      .select("COALESCE(SUM(t.amount), 0)", "total")
      .where("t.client_id = :clientId", { clientId })
      .andWhere("t.status = :status", { status: "active" })
      .getRawOne();

    const balance = parseFloat(result.total);
    await clientRepository.update(clientId, { balance });
    cache.del("dataClients");

    return balance;
  }

  // ==================== CLIENTES ====================

  static async getClients(req: Request, res: Response) {
    const data = cache.get("dataClients");
    if (data) {
      console.log("serving clients from cache");
      res.status(200).json({ data });
      return
    } else {
      console.log("serving clients from db");
      const clientRepository = initDataSource.getRepository(ClientEntity);
      const clients = await clientRepository.find();
      cache.put("dataClients", clients, 6000);
      res.status(200).json({ data: clients });
      return
    }
  }

  static async getClientById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const client = await initDataSource.getRepository(ClientEntity)
        .createQueryBuilder("client")
        .leftJoinAndSelect("client.transactions", "transaction", "transaction.status = :status", { status: "active" })
        .where("client.id = :id", { id })
        .orderBy("transaction.date", "DESC")
        .getOne();

      if (!client) {
        res.status(404).json({ status: false, message: "Cliente no encontrado" });
        return
      }

      res.status(200).json({ status: true, data: client });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al obtener el cliente" });
      return
    }
  }

  static async createClient(req: Request, res: Response) {
    try {
      const { cedula, nombre, apellido } = req.body;
      if (!cedula || !nombre || !apellido) {
        res.status(400).json({ status: false, message: "Todos los campos son requeridos" });
        return
      }

      const clientRepository = initDataSource.getRepository(ClientEntity);

      const findClient = await clientRepository.findOne({ where: { cedula } });
      if (findClient) {
        res.status(409).json({ status: false, message: "Ya existe un cliente con esta cédula" });
        return
      }

      const client = new ClientEntity();
      client.cedula = cedula;
      client.nombre = nombre;
      client.apellido = apellido;

      await clientRepository.save(client);
      cache.del("dataClients");

      const clientDataSent = new ClientResponseDTO();
      clientDataSent.id = client.id;
      clientDataSent.cedula = client.cedula;
      clientDataSent.nombre = client.nombre;
      clientDataSent.apellido = client.apellido;
      clientDataSent.balance = client.balance;

      res.status(200).json({ message: "Cliente creado exitosamente", data: clientDataSent });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al crear el cliente" });
      return
    }
  }

  static async updateClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { cedula, nombre, apellido } = req.body;

      const clientRepository = initDataSource.getRepository(ClientEntity);
      const clientUpdate = await clientRepository.findOne({ where: { id } });

      if (!clientUpdate) {
        res.status(404).json({ status: false, message: "Cliente no encontrado" });
        return
      }

      if (cedula && cedula !== clientUpdate.cedula) {
        const findExisting = await clientRepository.findOne({ where: { cedula } });
        if (findExisting) {
          res.status(409).json({ status: false, message: "Ya existe un cliente con esta cédula" });
          return
        }
        clientUpdate.cedula = cedula;
      }

      if (nombre) clientUpdate.nombre = nombre;
      if (apellido) clientUpdate.apellido = apellido;

      await clientRepository.save(clientUpdate);
      cache.del("dataClients");

      res.status(200).json({ status: true, message: "Cliente actualizado", data: clientUpdate });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al actualizar el cliente" });
      return
    }
  }

  static async deleteClient(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const clientRepository = initDataSource.getRepository(ClientEntity);
      const clientDelete = await clientRepository.findOne({ where: { id } });

      if (!clientDelete) {
        res.status(404).json({ status: false, message: "Cliente no encontrado" });
        return
      }

      await clientRepository.remove(clientDelete);
      cache.del("dataClients");

      res.status(200).json({ status: true, message: "Cliente eliminado" });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al eliminar el cliente" });
      return
    }
  }

  // ==================== TRANSACCIONES ====================

  static async getClientTransactions(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const includeDeleted = req.query.includeDeleted === 'true';

      const clientRepository = initDataSource.getRepository(ClientEntity);
      const client = await clientRepository.findOne({ where: { id: clientId } });
      if (!client) {
        res.status(404).json({ status: false, message: "Cliente no encontrado" });
        return
      }

      const transactionRepository = initDataSource.getRepository(ClientTransactionEntity);
      const whereCondition: any = { client: { id: clientId } };
      if (!includeDeleted) {
        whereCondition.status = "active";
      }

      const transactions = await transactionRepository.find({
        where: whereCondition,
        order: { date: "DESC" },
      });

      res.status(200).json({ status: true, data: transactions });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al obtener las transacciones" });
      return
    }
  }

  static async createTransaction(req: Request, res: Response) {
    try {
      const { clientId } = req.params;
      const { amount, description, date } = req.body;

      if (amount === undefined || amount === null || !description || !date) {
        res.status(400).json({ status: false, message: "Todos los campos son requeridos" });
        return
      }

      const clientRepository = initDataSource.getRepository(ClientEntity);
      const client = await clientRepository.findOne({ where: { id: clientId } });
      if (!client) {
        res.status(404).json({ status: false, message: "Cliente no encontrado" });
        return
      }

      const transactionRepository = initDataSource.getRepository(ClientTransactionEntity);
      const transaction = new ClientTransactionEntity();
      transaction.amount = parseFloat(amount);
      transaction.description = description;
      transaction.date = new Date(date);
      transaction.client = client;

      await transactionRepository.save(transaction);

      const newBalance = await ClientsController.recalculateBalance(clientId);

      const transactionDataSent = new ClientTransactionResponseDTO();
      transactionDataSent.id = transaction.id;
      transactionDataSent.amount = transaction.amount;
      transactionDataSent.description = transaction.description;
      transactionDataSent.date = transaction.date;
      transactionDataSent.status = transaction.status;

      res.status(200).json({
        message: "Transacción creada exitosamente",
        data: transactionDataSent,
        balance: newBalance,
      });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al crear la transacción" });
      return
    }
  }

  static async updateTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, transactionId } = req.params;
      const { amount, description, date } = req.body;

      const transactionRepository = initDataSource.getRepository(ClientTransactionEntity);
      const transaction = await transactionRepository.findOne({
        where: { id: transactionId, client: { id: clientId }, status: "active" },
      });

      if (!transaction) {
        res.status(404).json({ status: false, message: "Transacción no encontrada" });
        return
      }

      if (amount !== undefined && amount !== null) transaction.amount = parseFloat(amount);
      if (description) transaction.description = description;
      if (date) transaction.date = new Date(date);

      await transactionRepository.save(transaction);

      const newBalance = await ClientsController.recalculateBalance(clientId);

      res.status(200).json({
        status: true,
        message: "Transacción actualizada",
        data: transaction,
        balance: newBalance,
      });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al actualizar la transacción" });
      return
    }
  }

  static async deleteTransaction(req: Request, res: Response): Promise<void> {
    try {
      const { clientId, transactionId } = req.params;

      const transactionRepository = initDataSource.getRepository(ClientTransactionEntity);
      const transaction = await transactionRepository.findOne({
        where: { id: transactionId, client: { id: clientId }, status: "active" },
      });

      if (!transaction) {
        res.status(404).json({ status: false, message: "Transacción no encontrada" });
        return
      }

      transaction.status = "deleted";
      await transactionRepository.save(transaction);

      const newBalance = await ClientsController.recalculateBalance(clientId);

      res.status(200).json({
        status: true,
        message: "Transacción eliminada",
        balance: newBalance,
      });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: false, message: "Error al eliminar la transacción" });
      return
    }
  }
}
