import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("publisher_publisher_id_unique", ["publisherId"], { unique: true })
@Entity("publisher")
export class Publisher {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "publisher_id", unique: true, length: 191 })
  publisherId: string;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @Column("varchar", {
    name: "status",
    length: 191,
    default: () => "requested",
  })
  status: string;

  @Column("varchar", { name: "token", nullable: true, length: 191 })
  token: string | null;

  @Column("varchar", { name: "user_id", nullable: true, length: 191 })
  userId: string | null;
}
