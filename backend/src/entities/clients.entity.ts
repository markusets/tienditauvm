import { Column, Entity, OneToMany } from "typeorm"
import { BaseEntity } from "../config/base.entity"
import { ClientTransactionEntity } from "./client.transactions.entity"

@Entity({ name: "clients" })
export class ClientEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  cedula: string;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  apellido: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  balance: number;

  @OneToMany(() => ClientTransactionEntity, (transaction) => transaction.client)
  transactions: ClientTransactionEntity[];
}
