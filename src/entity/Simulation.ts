import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EventSimulation } from "./EventSimulation";

@Index("simulation_url_unique", ["url"], { unique: true })
@Entity("simulation")
export class Simulation {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "url", unique: true, length: 191 })
  url: string;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("varchar", { name: "image_url", nullable: true, length: 191 })
  imageUrl: string | null;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;

  @OneToMany(
    () => EventSimulation,
    (eventSimulation) => eventSimulation.simulation
  )
  eventSimulations: EventSimulation[];
}
