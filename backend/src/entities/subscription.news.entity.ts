import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { BaseEntity } from "../config/base.entity"

@Entity()
export class SubscriptionNews extends BaseEntity {
  @Column({ nullable: false })
  subscribeEmail: string;

  @Column({ default: "active" })
  status: string;
}
