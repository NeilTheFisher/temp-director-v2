import mysql, { RowDataPacket } from 'mysql2/promise'

export class DbManager {
	private connection: mysql.Connection | null = null

	constructor() {
		this.connect()
	}

	private async connect() {
		try {
			const connectionConfig = {
				host: process.env.MYSQL_SOCKET_ADDRESS ?? 'localhost',
				port: Number(process.env.MYSQL_SOCKET_PORT) || 3306,
				user: process.env.MYSQL_USER ?? 'root',
				password: process.env.MYSQL_PASSWORD ?? 'password',
				database: process.env.MYSQL_DATABASE ?? 'db_director',
			}
			console.log('Connection details:', connectionConfig)

			this.connection = await mysql.createConnection(connectionConfig)

			console.log('Connected to the database.')
		} catch (error) {
			console.error('Error connecting to the database:', error)
		}
	}

	public async query(sql: string, values?: string[]) {
		if (!this.connection) {
			// Reconnect if the connection is not available
			await this.connect()
		}
		await this.connection?.ping()

		try {
			const [rows] = await this.connection!.query(sql, values)
			return rows
		} catch (error) {
			console.error('Error executing SQL query:', error)
			throw error
		}
	}

	public async closeConnection() {
		if (this.connection) {
			await this.connection.end()
			console.log('Connection closed.')
		}
	}

	public async fetchData(
		tableName: string,
		key: string,
		valueCondition: string,
		columnWanted: string
	) {
		const result: RowDataPacket[] = await this.query(
			`SELECT ${columnWanted} FROM ?? WHERE ?? = ?`,
			[tableName, key, valueCondition]
		) as RowDataPacket[]
		console.log('fetchData result: ', result)
		return result
	}

	public async insertData(
		tableName: string,
		keys: string[],
		values: string[]
	): Promise<boolean> {
		try {
			const keysString = keys.join(', ')
			const valuesString = values.map(() => '?').join(', ')

			const result = await this.query(
				`INSERT INTO \`${tableName}\` (${keysString}) VALUES (${valuesString})`,
				values
			)
			console.log('insertData result:', result)
			return true
		} catch (error) {
			console.error('Error executing SQL query:', error)
			throw error
		}
	}

	public async updateData(
		tableName: string,
		primaryKey: string,
		id: string,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		updateValues: Record<string, any>
	): Promise<unknown> {
		try {
			const updateString = updateValues
				.map((item: string) =>
					Object.keys(item)
						.map((key) => `${key} = ?`)
						.join(', ')
				)
				.join(', ')
			console.log('updateString:', updateString)

			const updateValues2 = updateValues.map((item: string) => Object.values(item)).flat()

			const result = await this.query(
				`UPDATE ${tableName} SET ${updateString} WHERE ${primaryKey} = ?`,
				[
					...updateValues2,
					id,
				]
			)
			console.log('updateData: result:', result)
			return true
		} catch (error) {
			console.error('Error executing SQL query:', error)
			throw error
		}
	}
}
