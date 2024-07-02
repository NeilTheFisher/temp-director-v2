import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Stream } from "./Stream";
import { Group } from "./Group";

@Index("pro_publisher_group_id_foreign", ["groupId"], {})
@Entity("pro_publisher")
export class ProPublisher {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "serial", length: 191 })
  serial: string;

  @Column("varchar", { name: "uid", length: 191 })
  uid: string;

  @Column("varchar", { name: "device_name", nullable: true, length: 191 })
  deviceName: string | null;

  @Column("int", { name: "code", nullable: true })
  code: number | null;

  @Column("varchar", { name: "name", nullable: true, length: 191 })
  name: string | null;

  @Column("longtext", { name: "otp", nullable: true })
  otp: string | null;

  @Column("varchar", { name: "password", nullable: true, length: 191 })
  password: string | null;

  @Column("tinyint", { name: "registered", width: 1, default: () => 0 })
  registered: boolean;

  @Column("bigint", { name: "group_id", nullable: true, unsigned: true })
  groupId: number | null;

  @Column("tinyint", { name: "running", width: 1, default: () => 0 })
  running: boolean;

  @OneToMany(() => Stream, (stream) => stream.propublisher)
  streams: Stream[];

  @ManyToOne(() => Group, (group) => group.proPublishers, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
