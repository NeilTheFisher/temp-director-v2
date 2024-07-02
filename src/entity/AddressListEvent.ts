import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { AddressList } from "./AddressList";
import { Event } from "./Event";

@Index("address_list_event_event_id_foreign", ["eventId"], {})
@Index("address_list_event_address_list_id_foreign", ["addressListId"], {})
@Entity("address_list_event")
export class AddressListEvent {
  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @PrimaryColumn("bigint", { name: "address_list_id", unsigned: true })
  addressListId: number;

  @ManyToOne(
    () => AddressList,
    (addressList) => addressList.addressListEvents,
    { onDelete: "RESTRICT", onUpdate: "RESTRICT" }
  )
  @JoinColumn([{ name: "address_list_id", referencedColumnName: "id" }])
  addressList: AddressList;

  @ManyToOne(() => Event, (event) => event.addressListEvents, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;
}
