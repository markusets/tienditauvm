import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { config } from "dotenv";
import cors from 'cors';

import { errorHandler } from './src/middlewares/error.middleware';
import {
  userRouter
} from './src/routers/users.router';
import { productRouter } from './src/routers/products.router';
import { categoryRouter } from './src/routers/categories.router';
import { subscriptionNewsRouter } from './src/routers/subscription.news.router';
import { initDataSource } from './src/db/data.source';

config();

const app = express();
const PORT = Number(process.env.PORT)
const HOST = process.env.HOST
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors(
  {
    origin: '*' ,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  }
));
  
app.use(express.json());
//app.use(errorHandler);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter);
app.use('/api', subscriptionNewsRouter);

initDataSource.initialize()
  .then(async () => {
        console.log("Data Source has been initialized!");
  })
  .catch((error) => {
    console.error("❌ Error al conectar a la base de datos:", error);
    process.exit(1); 
});

app.listen(PORT, HOST, () => {
      console.log(`Server is running on ${HOST}:${PORT})`);
});
