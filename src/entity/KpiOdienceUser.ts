import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { KpiUserDeviceInteraction } from "./KpiUserDeviceInteraction";
import { KpiOdienceUserToUserCall } from "./KpiOdienceUserToUserCall";
import { KpiMessageSent } from "./KpiMessageSent";
import { KpiUserQrCodeScan } from "./KpiUserQrCodeScan";
import { KpiUserPictureTaken } from "./KpiUserPictureTaken";

@Index("kpi_odience_user_msisdn_unique", ["msisdn"], { unique: true })
@Index("kpi_odience_user_user_hash_unique", ["userHash"], { unique: true })
@Entity("kpi_odience_user")
export class KpiOdienceUser {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "msisdn", unique: true, length: 191 })
  msisdn: string;

  @Column("varchar", { name: "user_hash", unique: true, length: 191 })
  userHash: string;

  @Column("int", { name: "created_at", default: () => 0})
  createdAt: number;

  @Column("int", { name: "updated_at", default: () => 0 })
  updatedAt: number;

  @OneToMany(
    () => KpiUserDeviceInteraction,
    (kpiUserDeviceInteraction) => kpiUserDeviceInteraction.msisdn2
  )
  kpiUserDeviceInteractions: KpiUserDeviceInteraction[];

  @OneToMany(
    () => KpiOdienceUserToUserCall,
    (kpiOdienceUserToUserCall) => kpiOdienceUserToUserCall.callee
  )
  kpiOdienceUserToUserCalls: KpiOdienceUserToUserCall[];

  @OneToMany(
    () => KpiOdienceUserToUserCall,
    (kpiOdienceUserToUserCall) => kpiOdienceUserToUserCall.msisdn2
  )
  kpiOdienceUserToUserCalls2: KpiOdienceUserToUserCall[];

  @OneToMany(() => KpiMessageSent, (kpiMessageSent) => kpiMessageSent.msisdn2)
  kpiMessageSents: KpiMessageSent[];

  @OneToMany(
    () => KpiUserQrCodeScan,
    (kpiUserQrCodeScan) => kpiUserQrCodeScan.msisdn2
  )
  kpiUserQrCodeScans: KpiUserQrCodeScan[];

  @OneToMany(
    () => KpiUserPictureTaken,
    (kpiUserPictureTaken) => kpiUserPictureTaken.msisdn2
  )
  kpiUserPictureTakens: KpiUserPictureTaken[];
}
