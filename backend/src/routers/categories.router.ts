import { Router } from 'express';
import { CategoryController } from '../controllers/categories.controller';
import { authentification, authorization } from "../middlewares/auth.middleware"

const router = Router();

router.get('/categories',
  authentification,
  authorization(['admin']),
  CategoryController.getCategories
);

router.post('/categories',
  authentification,
  authorization(['admin']),
  CategoryController.createCategory
);

router.put('/categories/:id',
  authentification,
  authorization(['admin']),
  CategoryController.updateCategory
);

router.delete('/categories/:id',
  authentification,
  authorization(['admin']),
  CategoryController.deleteCategory
);

export { router as categoryRouter }
