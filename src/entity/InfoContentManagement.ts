import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("info_content_management")
export class InfoContentManagement {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "file_name", length: 191, default: () => "''" })
  fileName: string;

  @Column("varchar", { name: "title", length: 191 })
  title: string;

  @Column("varchar", { name: "sub_title", length: 191, default: () => "''" })
  subTitle: string;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("varchar", { name: "url", length: 191 })
  url: string;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;
}
