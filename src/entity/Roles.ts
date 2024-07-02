import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("roles")
export class Roles {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;
}
