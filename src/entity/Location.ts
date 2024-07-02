import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("location")
export class Location {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("decimal", { name: "latitude", precision: 10, scale: 8 })
  latitude: string;

  @Column("decimal", { name: "longitude", precision: 10, scale: 8 })
  longitude: string;

  @Column("varchar", { name: "country", nullable: true, length: 191 })
  country: string | null;

  @Column("varchar", { name: "region", nullable: true, length: 191 })
  region: string | null;

  @Column("varchar", { name: "city", nullable: true, length: 191 })
  city: string | null;

  @Column("varchar", { name: "address", nullable: true, length: 191 })
  address: string | null;
}
