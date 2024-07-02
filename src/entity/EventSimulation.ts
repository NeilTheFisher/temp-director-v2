import { PrimaryColumn, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Event } from "./Event";
import { Simulation } from "./Simulation";

@Index("event_simulation_simulation_id_foreign", ["simulationId"], {})
@Index("event_simulation_event_id_foreign", ["eventId"], {})
@Entity("event_simulation")
export class EventSimulation {
  @PrimaryColumn("bigint", { name: "simulation_id", unsigned: true })
  simulationId: number;

  @PrimaryColumn("bigint", { name: "event_id", unsigned: true })
  eventId: number;

  @ManyToOne(() => Event, (event) => event.eventSimulations, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "event_id", referencedColumnName: "id" }])
  event: Event;

  @ManyToOne(() => Simulation, (simulation) => simulation.eventSimulations, {
    onDelete: "RESTRICT",
    onUpdate: "RESTRICT",
  })
  @JoinColumn([{ name: "simulation_id", referencedColumnName: "id" }])
  simulation: Simulation;
}
