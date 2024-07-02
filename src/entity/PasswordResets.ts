import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Index("password_resets_email_index", ["email"], {})
@Entity("password_resets")
export class PasswordResets {
  @PrimaryColumn("varchar", { name: "email", length: 191 })
  email: string;

  @Column("varchar", { name: "token", length: 191 })
  token: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;
}
