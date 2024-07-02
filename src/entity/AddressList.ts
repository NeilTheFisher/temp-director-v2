import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { AddressListGroup } from "./AddressListGroup";
import { AddressListEvent } from "./AddressListEvent";

@Entity("address_list")
export class AddressList {
  @PrimaryGeneratedColumn({ type: "bigint", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "name", length: 191 })
  name: string;

  @Column("int", { name: "date", default: () => "UNIX_TIMESTAMP()" })
  date: number;

  @Column("longtext", { name: "recipients", nullable: true })
  recipients: string | null;

  @OneToMany(
    () => AddressListGroup,
    (addressListGroup) => addressListGroup.addressList
  )
  addressListGroups: AddressListGroup[];

  @OneToMany(
    () => AddressListEvent,
    (addressListEvent) => addressListEvent.addressList
  )
  addressListEvents: AddressListEvent[];
}
