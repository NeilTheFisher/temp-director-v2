import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("short_url")
export class ShortUrl {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("longtext", { name: "url" })
  url: string;

  @Column("int", { name: "expiry" })
  expiry: number;

  @Column("varchar", { name: "key", length: 191 })
  key: string;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;
}
