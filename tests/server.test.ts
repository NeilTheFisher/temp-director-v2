jest.mock('../src/utils/dbmanager.ts')

import { DirectorApi } from '../src/server'
import { InMemoryDatabase } from './utils/sqlite_test'
import { User } from '../src/model/User'
import * as Utils from '../src/utils/utils'
import { Group } from '../src/model/Group'
import { Role } from '../src/model/Role'
import { GroupUser } from '../src/model/GroupUser'
import { ModelRole } from '../src/model/ModelRole'


describe('test_routes', () => {
	let directorApiServer: DirectorApi

	beforeAll(async () => {
		const inMemoryDb = new InMemoryDatabase()
		await inMemoryDb.initialize()
		await fill_up_db(inMemoryDb)

		directorApiServer = new DirectorApi(inMemoryDb)
		directorApiServer.startServer(12345)

		jest.spyOn(directorApiServer.getDbManager(), 'query').mockImplementation((sql: string, values?: string[]) => {
			return new Promise((resolve, reject) => {
				console.log(`Fetching sql ${sql} with params ${values}`)
				inMemoryDb.getDb().all(sql, values, (err, rows) => {
					if (err) {
						console.error(`Failed fetching data (${sql}) with error (${err})`)
						reject(err)
					} else {
						console.debug('Fetched rows', rows)
						resolve(rows)
					}
				})
			})
		})
	})

	test('test_jwt_verify_invalid_token', (done) => {
		fetch(new URL('/api/getUserInfo', 'http://127.0.0.1:12345'), {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer invalidToken'
			}
		}).then((Response) => {
			console.log('Received response -> ', Response.status, Response.statusText)
			expect(Response.ok).toBe(false)
			expect(Response.status).toBe(401)
			done()
		})
	})

	test('get_user_info_unknown_user', (done) => {

		jest.spyOn(Utils, 'verifyAccess').mockImplementation((_a: any) => {
			return new Promise<string>((resolve, _reject) => {
				resolve('3')
			})
		})

		fetch(new URL('/api/getUserInfo', 'http://127.0.0.1:12345'), {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer invalidToken'
			}
		}).then((Response) => {
			console.log('Received response -> ', Response.status, Response.statusText)
			expect(Response.ok).toBe(false)
			expect(Response.status).toBe(401)
			done()
		})
	})

	test('success_get_user_info', (done) => {
		jest.spyOn(Utils, 'verifyAccess').mockImplementation((_a: any) => {
			return new Promise<string>((resolve, _reject) => {
				resolve('1')
			})
		})

		fetch(new URL('/api/getUserInfo', 'http://127.0.0.1:12345'), {
			method: 'GET',
			headers: {
				'Authorization': 'Bearer validToken'
			}
		}).then((Response) => {
			console.log('Received response -> ', Response.status, Response.statusText)
			if (Response.ok) {
				Response.json().then((jsonResponse) => {
					const expected = {
						user_id: 1,
						group_id: 1,
						name: 'John Doe',
						avatar: null,
						msisdn: '15145550000',
						image_uid: null,
						pns_settings: {
							pns_event_created: true,
							pns_event_updated: true,
							pns_event_registered: true,
							pns_event_mention: true
						},
						usersReported: [],
						usersBlocked: [],
						usersBlockedBy: [],
						roles: { super_admin: false, organizations: { '1': [
							'admin',
							'manager',
							'moderator'
						] } }
					}
					expect(jsonResponse).toEqual(expected)
					done()
				})
			}
		})
	})

	afterAll(async () => {
		await directorApiServer.close()
		jest.restoreAllMocks()
	})
})


async function fill_up_db(inMemoryDb: InMemoryDatabase) {
	// Add some tests data
	const user: User = {
		name: 'John Doe',
		password: '1234567890',
		msisdn: '15145550000',
		otp: '123456789123456789123456789',
		personal_group_id: 1,
		type: 'user',
		account_type: 1,
		is_deleted: 0,
		id: 1,
		email: null,
		email_verified_at: null,
		remember_token: null,
		created_at: new Date(),
		updated_at: new Date(),
		created_by: null,
		otp_created_at: new Date(),
		image_uid: null,
		verif_code: null,
		verif_expir: null,
		timezone: null,
		avatar_url: null,
		deleted_timestamp: null
	}
	const userLastId = await inMemoryDb.insertUser(user)
	console.log('User created with ID:', userLastId)

	const group: Group = {
		id: 1,
		name: 'PrivateGroup:[15145550000]',
		created_at: new Date(),
		updated_at: new Date(),
		is_public: 0,
		owner_id: null,
		image_uid: null,
		image_url: null
	}
	const groupLastId = await inMemoryDb.insertGroup(group)
	console.log('Group created with ID:', groupLastId)

	const userGroup: GroupUser = {
		group_id: groupLastId,
		user_id: userLastId,
		id: 1
	}
	await inMemoryDb.insertGroupUser(userGroup)

	const role1: Role = {
		id: 1,
		name: JSON.stringify({
			'r': 'admin',
			'g': 1
		}),
		guard_name: 'web',
		created_at: new Date(),
		updated_at: new Date()
	}
	const role2: Role = {
		id: 2,
		name: JSON.stringify({
			'r': 'manager',
			'g': 1
		}),
		guard_name: 'web',
		created_at: new Date(),
		updated_at: new Date()
	}
	const role3: Role = {
		id: 3,
		name: JSON.stringify({
			'r': 'moderator',
			'g': 1
		}),
		guard_name: 'web',
		created_at: new Date(),
		updated_at: new Date()
	}
	await inMemoryDb.insertRole(role1)
	await inMemoryDb.insertRole(role2)
	await inMemoryDb.insertRole(role3)

	const modelHasRole1: ModelRole = {
		role_id: role1.id,
		model_type: 'App\\Models\\User',
		model_id: userLastId,
	}
	const modelHasRole2: ModelRole = {
		role_id: role2.id,
		model_type: 'App\\Models\\User',
		model_id: userLastId,
	}
	const modelHasRole3: ModelRole = {
		role_id: role3.id,
		model_type: 'App\\Models\\User',
		model_id: userLastId,
	}
	await inMemoryDb.insertModelHasRole(modelHasRole1)
	await inMemoryDb.insertModelHasRole(modelHasRole2)
	await inMemoryDb.insertModelHasRole(modelHasRole3)
}