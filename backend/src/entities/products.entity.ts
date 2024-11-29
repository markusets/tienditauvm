import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { BaseEntity } from "../config/base.entity"
import { CategoryEntity } from "./categories.entity";

@Entity({ name: "products" })
export class ProductEntity extends BaseEntity {
  @Column({ nullable: false })
  productName: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  price: number;

  @Column()
  urlPhoto: string;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity
}
