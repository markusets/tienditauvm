import { Request, Response } from 'express';
import * as cache from "memory-cache";
import { initDataSource } from '../db/data.source';
import { CategoryEntity } from '../entities/categories.entity';
import { CategoryResponceDTO } from '../dtos/categories.dto';


export class CategoryController {
  static async getCategories(req: Request, res: Response) {
    const data = cache.get("dataCategory");
    if (data) {
      console.log("serving from cache");
      res.status(200).json({
        data,
      });
      return
    } else {
      console.log("serving from db");
      const categoryRepository = initDataSource.getRepository(CategoryEntity);
      const category = await categoryRepository.find();

      cache.put("dataCategory", category, 6000);
      res.status(200).json({
        data: category,
      });
      return
    }
  }

  static async createCategory(req: Request, res: Response) {
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({ status: false, message: "All fields are required" })
      return
    }

    const findCategory = await initDataSource.
      getRepository(CategoryEntity).
      findOne({ where: { categoryName } });

    if (findCategory) {
      res.status(409).json({ status: false, message: "Conflict Category already exists" })
      return
    }

    const category = new CategoryEntity();
    category.categoryName = categoryName;

    const categoryRepository = initDataSource.getRepository(CategoryEntity);
    await categoryRepository.save(category);

    const categoryDataSent = new CategoryResponceDTO();
    categoryDataSent.id = category.id;
    categoryDataSent.categoryName = category.categoryName;
    res
      .status(200)
      .json({ message: "Category created successfully", categoryDataSent });
    return
  }
  static async updateCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { categoryName } = req.body;

    const categoryRepository = initDataSource.getRepository(CategoryEntity);
    const categoryUpdate = await categoryRepository.findOne({
      where: { id },
    });

    if (!categoryUpdate) {
      res.status(404).json({ status: false, message: "Category not found" });
      return
    }

    categoryUpdate.categoryName = categoryName;
    await categoryRepository.save(categoryUpdate);
    res.status(200).json({ status: true, message: "udpdated", categoryUpdate });
    return
  }

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const categoryRepository = initDataSource.getRepository(CategoryEntity)
    const categoryDelete = await categoryRepository.findOne({
      where: { id },
    });
    if (!categoryDelete) {
      res.status(404).json({ status: false, message: "Category not found" });
      return
    }
    await categoryRepository.remove(categoryDelete)
    res.status(200).json({ status: true, message: "deleted" });
    return
  }
}
