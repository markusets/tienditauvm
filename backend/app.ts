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
const PORT = process.env.PORT || 3000;
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use(cors(
  {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
));

app.use(express.json());
app.use(errorHandler)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', userRouter);
app.use('/api', productRouter);
app.use('/api', categoryRouter)
app.use('/api', subscriptionNewsRouter)

initDataSource.initialize()
  .then(async () => {
    app.listen(3000, '0.0.0.0', () => {
      console.log(`Server is running on port ${process.env.PORT})`);
    });
    console.log("Data Source has been initialized!");
  })
  .catch((error) => console.log(error));
