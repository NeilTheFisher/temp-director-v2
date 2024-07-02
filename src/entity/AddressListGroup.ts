import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AddressList } from "./AddressList";
import { Group } from "./Group";

@Index("address_list_group_group_id_foreign", ["groupId"], {})
@Index("address_list_group_address_list_id_foreign", ["addressListId"], {})
@Entity("address_list_group")
export class AddressListGroup {
  @PrimaryColumn("bigint", { name: "group_id", unsigned: true })
  groupId: number;

  @PrimaryColumn("bigint", { name: "address_list_id", unsigned: true })
  addressListId: number;

  @ManyToOne(
    () => AddressList,
    (addressList) => addressList.addressListGroups,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "address_list_id", referencedColumnName: "id" }])
  addressList: AddressList;

  @ManyToOne(() => Group, (group) => group.addressListGroups, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
