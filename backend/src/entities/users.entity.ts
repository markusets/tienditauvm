import {
  Entity,
  Column,
} from "typeorm";
import { BaseEntity } from "../config/base.entity";

@Entity({ name: "users" })
export class User extends BaseEntity {

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ default: "user" })
  role: string;
}
