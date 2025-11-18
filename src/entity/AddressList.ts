import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from "typeorm"
import { Group } from "./Group"
import { AddressListEvent } from "./AddressListEvent"

@Entity("address_list")
export class AddressList {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number

  @Column("varchar", { name: "name", length: 191 })
  name: string

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number

  @Column("longtext", { name: "recipients", nullable: true })
  recipients: string | null

  @ManyToOne(() => Group, (group) => group.devices)
  @JoinColumn({ name: "group_id" })
  group: Group

  @Column({name: "group_id", type: "bigint", unsigned: true })
  groupId: number

  @OneToMany(
    () => AddressListEvent,
    (addressListEvent) => addressListEvent.addressList
  )
  addressListEvents: AddressListEvent[]
}
