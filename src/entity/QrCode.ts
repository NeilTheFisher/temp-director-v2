import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index(
  "qr_code_configurable_type_configurable_id_index",
  ["configurableType", "configurableId"],
  {}
)
@Entity("qr_code")
export class QrCode {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "type", length: 191 })
  type: string;

  @Column("varchar", { name: "configurable_type", nullable: true, length: 191 })
  configurableType: string | null;

  @Column("bigint", { name: "configurable_id", nullable: true, unsigned: true })
  configurableId: number | null;

  @Column("longtext", { name: "url", nullable: true })
  url: string | null;
}
