import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiOdienceUser } from "./KpiOdienceUser";

@Index("kpi_user_picture_taken_msisdn_foreign", ["msisdn"], {})
@Entity("kpi_user_picture_taken")
export class KpiUserPictureTaken {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", length: 191 })
  msisdn: string;

  @Column("varchar", { name: "event_id", length: 191 })
  eventId: string;

  @Column("int", { name: "date", default: () => 0 })
  date: number;

  @Column("double", {
    name: "camera_x",
    precision: 8,
    scale: 2,
    default: () => 0.00,
  })
  cameraX: number;

  @Column("double", {
    name: "camera_y",
    precision: 8,
    scale: 2,
    default: () => 0.00,
  })
  cameraY: number;

  @Column("double", {
    name: "camera_zoom",
    precision: 8,
    scale: 2,
    default: () => 1.00,
  })
  cameraZoom: number;

  @Column("int", { name: "time_in_event", default: () => 0 })
  timeInEvent: number;

  @Column("int", { name: "created_at", default: () => 0 })
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @ManyToOne(
    () => KpiOdienceUser,
    (kpiOdienceUser) => kpiOdienceUser.kpiUserPictureTakens,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "msisdn", referencedColumnName: "msisdn" }])
  msisdn2: KpiOdienceUser;
}
