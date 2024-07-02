import { Entity, Index, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Device } from "./Device";
import { Group } from "./Group";

@Index("device_group_group_id_foreign", ["groupId"], {})
@Index("device_group_device_id_foreign", ["deviceId"], {})
@Entity("device_group")
export class DeviceGroup {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "device_id", unsigned: true })
  deviceId: number;

  @ManyToOne(() => Device, (device) => device.deviceGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "device_id", referencedColumnName: "id" }])
  device: Device;

  @ManyToOne(() => Group, (group) => group.deviceGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
