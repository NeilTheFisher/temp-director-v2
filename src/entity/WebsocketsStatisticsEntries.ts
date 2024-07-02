import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("websockets_statistics_entries")
export class WebsocketsStatisticsEntries {
  @PrimaryGeneratedColumn({ type: "int", name: "id", unsigned: true })
  id: number;

  @Column("varchar", { name: "app_id", length: 191 })
  appId: string;

  @Column("int", { name: "peak_connections_count" })
  peakConnectionsCount: number;

  @Column("int", { name: "websocket_messages_count" })
  websocketMessagesCount: number;

  @Column("int", { name: "api_messages_count" })
  apiMessagesCount: number;

  @Column("timestamp", { name: "created_at", nullable: true })
  createdAt: Date | null;

  @Column("timestamp", { name: "updated_at", nullable: true })
  updatedAt: Date | null;
}
