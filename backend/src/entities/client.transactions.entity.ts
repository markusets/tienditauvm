import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { BaseEntity } from "../config/base.entity"
import { ClientEntity } from "./clients.entity"

@Entity({ name: "client_transactions" })
export class ClientTransactionEntity extends BaseEntity {
  @Column({ type: "decimal", precision: 10, scale: 2, nullable: false })
  amount: number;

  @Column({ nullable: false })
  description: string;

  @Column({ type: "timestamp", nullable: false })
  date: Date;

  @Column({ default: "active" })
  status: string;

  @ManyToOne(() => ClientEntity, (client) => client.transactions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "client_id" })
  client: ClientEntity;
}
