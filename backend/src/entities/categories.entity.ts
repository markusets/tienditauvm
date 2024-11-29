import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../config/base.entity"
import { ProductEntity } from "./products.entity";

@Entity({ name: "category" })
export class CategoryEntity extends BaseEntity {
  @Column({ nullable: false })
  categoryName: string;

  @OneToMany(() => ProductEntity, (product) => product.category)
  products: CategoryEntity
}
