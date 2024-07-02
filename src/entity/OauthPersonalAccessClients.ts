import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("oauth_personal_access_clients")
export class OauthPersonalAccessClients {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("char", { name: "client_id", length: 36 })
  clientId: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;
}
