import { Router } from 'express';
import { ClientsController } from '../controllers/clients.controller';
import { authentification, authorization } from "../middlewares/auth.middleware"

const router = Router();

// Client CRUD
router.get('/clients',
  authentification,
  authorization(['admin']),
  ClientsController.getClients
);

router.get('/clients/:id',
  authentification,
  authorization(['admin']),
  ClientsController.getClientById
);

router.post('/clients',
  authentification,
  authorization(['admin']),
  ClientsController.createClient
);

router.put('/clients/:id',
  authentification,
  authorization(['admin']),
  ClientsController.updateClient
);

router.delete('/clients/:id',
  authentification,
  authorization(['admin']),
  ClientsController.deleteClient
);

// Transaction CRUD (nested under client)
router.get('/clients/:clientId/transactions',
  authentification,
  authorization(['admin']),
  ClientsController.getClientTransactions
);

router.post('/clients/:clientId/transactions',
  authentification,
  authorization(['admin']),
  ClientsController.createTransaction
);

router.put('/clients/:clientId/transactions/:transactionId',
  authentification,
  authorization(['admin']),
  ClientsController.updateTransaction
);

router.delete('/clients/:clientId/transactions/:transactionId',
  authentification,
  authorization(['admin']),
  ClientsController.deleteTransaction
);

export { router as clientsRouter }
