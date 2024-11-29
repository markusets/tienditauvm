import { Router } from 'express';
import { ProductsController } from '../controllers/products.controller';
import { authentification, authorization } from "../middlewares/auth.middleware"

const router = Router();

router.get('/products/category',
  authentification,
  authorization(['admin']),
  ProductsController.getProductsWithCategory
);

router.get('/products/name/:productName',
  ProductsController.getProductByName
);

router.get('/products/:id',
  ProductsController.getProductById
);

router.get('/products',
  //authentification,
  //authorization(['admin']),
  ProductsController.getProducts
);

router.post('/products',
  authentification,
  authorization(['admin']),
  ProductsController.createProduct
);

router.put('/products/:id',
  authentification,
  authorization(['admin']),
  ProductsController.updateProduct
);

router.delete('/products/:id',
  authentification,
  authorization(['admin']),
  ProductsController.deleteProduct
);

export { router as productRouter };
