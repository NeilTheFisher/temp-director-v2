import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Index("cache_key_unique", ["key"], { unique: true })
@Entity("cache")
export class Cache {
  @PrimaryColumn("varchar", { name: "key", length: 191 })
  key: string;

  @Column("text", { name: "value" })
  value: string;

  @Column("int", { name: "expiration" })
  expiration: number;
}
