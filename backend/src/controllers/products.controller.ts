import fs from 'node:fs';
import path from 'node:path';
import { Request, Response } from 'express';
import * as cache from "memory-cache";
import { initDataSource } from '../db/data.source';
import { ProductEntity } from '../entities/products.entity';
import { CategoryEntity } from '../entities/categories.entity';
import { ProductResponseDTO } from '../dtos/products.dto';
import { uploadPhoto } from "../utils/upload.multer"

export class ProductsController {
  static async getProducts(req: Request, res: Response) {
    const data = cache.get("data");
    if (data) {
      console.log("serving from cache");
      res.status(200).json({
        data,
      });
      return
    } else {
      console.log("serving from db");
      const productRepository = initDataSource.getRepository(ProductEntity);
      const products = await productRepository.find();
      cache.put("data", products, 6000);
      res.status(200).json({
        data: products,
      });
      return
    }
  }

  static async getProductsWithCategory(req: Request, res: Response) {
    try {
      const getProductsWithCategory = await initDataSource.getRepository(ProductEntity)
        .createQueryBuilder("product")
        .leftJoinAndSelect("product.category", "category")
        .getMany();

      if (!getProductsWithCategory) {
        res.status(404).json({
          data: [],
          status: false,
        });
        return
      }

      res.status(200).json({
        message: "Productos obtenidos con éxito",
        data: getProductsWithCategory,
      });
      return
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: "Error al obtener los productos",
        error: error.message,
      });
      return
    }
  }

  static async getProductById(req: Request, res: Response) {
    const { id } = req.params;
    const productRepository = initDataSource.getRepository(ProductEntity);
    const getProductsWithCategoryById = await productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category") // Incluimos la relación con la categoría
      .where("product.id = :id", { id }) // Condición para filtrar por ID
      .getOne();

    if (!getProductsWithCategoryById) {
      res.status(404).json({ status: false, message: "Product not found" });
      return
    }
    res.status(200).json({
      status: true,
      data: getProductsWithCategoryById,
    });
  }

  static async createProduct(req: Request, res: Response) {
    uploadPhoto(req, res, async (err) => {
      if (err) {
        res.status(400).json({ status: false, message: err.message || "Error uploading photo" });
        return;
      }
      console.log("Body", req.body, "file", req.file)
      const { productName, description, price, category_id } = req.body;
      if (!productName || !description || !price || !category_id) {
        res.status(400).json({ status: false, message: "Product missing required fields" });
        return;
      }

      const categoryRepository = initDataSource.getRepository(CategoryEntity);
      const category = await categoryRepository.findOne({ where: { id: category_id } });

      if (!category) {
        res.status(404).json({ status: false, message: "Category not found" });
        return;
      }

      const product = new ProductEntity();
      product.productName = productName;
      product.description = description;
      product.price = price;
      product.category = category_id;

      if (req.file) {
        product.urlPhoto = `/uploads/${req.file.filename}`;
      } else {
        res.status(400).json({ status: false, message: "Photo is required" });
        return;
      }

      const productRepository = initDataSource.getRepository(ProductEntity);
      await productRepository.save(product);

      const productDataSent = new ProductResponseDTO();
      productDataSent.id = product.id;
      productDataSent.productName = product.productName;
      productDataSent.description = product.description;
      productDataSent.price = product.price;
      productDataSent.category_id = product.category.id;

      res.status(200).json({ status: true, message: "Product created successfully", productDataSent });
    });
  }

  static async updateProduct(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    uploadPhoto(req, res, async (err) => {
      if (err) {
        res.status(400).json({ status: false, message: err.message || "Error uploading photo" });
        return;
      }

      const { productName, description, price, category_id } = req.body;
      if (!productName && !description && !price && !category_id && !req.file) {
        res.status(400).json({ status: false, message: "No data to update" });
        return;
      }

      const productRepository = initDataSource.getRepository(ProductEntity);
      const categoryRepository = initDataSource.getRepository(CategoryEntity);
      const productUpdate = await productRepository.findOne({ where: { id } });
      if (!productUpdate) {
        res.status(404).json({ status: false, message: "Product not found" });
        return;
      }

      let categoryUpdate = null;
      if (category_id) {
        categoryUpdate = await categoryRepository.findOne({ where: { id: category_id } });
        if (!categoryUpdate) {
          res.status(404).json({ status: false, message: "Category not found" });
          return;
        }
        productUpdate.category = categoryUpdate;
      }

      if (productUpdate.urlPhoto) {
        const relativePhotoPath = productUpdate.urlPhoto.split('/uploads/')[1];
        const photoPath = path.join(__dirname, '../../uploads', relativePhotoPath);
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.error("Error deleting photo:", err);
          } else {
            console.log("Photo deleted successfully:", photoPath);
          }
        });
      }

      if (productName) productUpdate.productName = productName;
      if (description) productUpdate.description = description;
      if (price) productUpdate.price = price;
      if (req.file) {
        if (productUpdate.urlPhoto) {
          const relativePhotoPath = productUpdate.urlPhoto.split('/uploads/')[1];
          const photoPath = path.join(__dirname, '../../uploads', relativePhotoPath);
          fs.unlink(photoPath, (err) => {
            if (err) {
              return
            } else {
              console.log("Photo deleted successfully:", photoPath);
            }
          });
        }
        productUpdate.urlPhoto = `/uploads/${req.file.filename}`;
      }

      try {
        await productRepository.save(productUpdate);
        const productDataResponse = new ProductResponseDTO();
        productDataResponse.id = productUpdate.id;
        productDataResponse.productName = productUpdate.productName;
        productDataResponse.description = productUpdate.description;
        productDataResponse.price = productUpdate.price;
        productDataResponse.category_id = productUpdate.category?.id;
        productDataResponse.urlPhoto = productUpdate.urlPhoto;

        res.status(200).json({ status: true, message: "Product updated successfully", product: productDataResponse });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ status: false, message: "Internal server error" });
      }
    });
  }

  static async deleteProduct(req: Request, res: Response) {
    const { id } = req.params;
    const productRepository = initDataSource.getRepository(ProductEntity);

    const product = await productRepository.findOne({
      where: { id },
    });

    if (!product) {
      res.status(404).json({ status: false, message: "Product not found" });
      return;
    }

    if (product.urlPhoto) {
      const relativePhotoPath = product.urlPhoto.split('/uploads/')[1];
      const photoPath = path.join(__dirname, '../../uploads', relativePhotoPath);
      fs.unlink(photoPath, (err) => {
        if (err) {
          console.error("Error deleting photo:", err);
        } else {
          console.log("Photo deleted successfully:", photoPath);
        }
      });
    }

    await productRepository.remove(product);
    res.status(200).json({
      status: true,
      message: "Product deleted successfully"
    });
    return
  }

  static async getProductByName(req: Request, res: Response) {
    const { productName } = req.params;

    if (!productName) {
      res.status(400).json({ status: false, message: "Product name is required" });
      return
    }
    const productRepository = initDataSource.getRepository(ProductEntity);

    try {
      const products = await productRepository
        .createQueryBuilder("product")
        .where("LOWER(product.productName) LIKE :productName", { productName: `%${productName.toLowerCase()}%` })
        .getMany();

      if (!products || products.length === 0) {
        res.status(404).json({ status: false, message: "Product not found" });
        return
      }

      res.status(200).json({
        status: true,
        data: products,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({
        status: false,
        message: "Internal server error",
      });
    }
  }
}


