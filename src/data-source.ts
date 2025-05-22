import { DataSource } from "typeorm"

let host = process.env.MYSQL_SOCKET_ADDRESS ?? "localhost:3306"
host = host.replace(/:\d+$/, "") // This regex removes the last : and numbers if present

export const AppDataSource = new DataSource({
  type: "mysql",
  host: host,
  port: Number(process.env.MYSQL_SOCKET_PORT) || 3306,
  username: process.env.MYSQL_USER ?? "root",
  password: process.env.MYSQL_PASSWORD ?? "password",
  database: process.env.MYSQL_DATABASE ?? "db_director",
  entities: ["build/entity/**/*.js", "entity/**/*.js"],
})
