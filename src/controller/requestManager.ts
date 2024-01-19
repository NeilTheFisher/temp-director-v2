import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { RowDataPacket } from 'mysql2'
import { Group } from '../model/Group'
import { GroupUser } from '../model/GroupUser'
import { OwnedGroups } from '../model/OwnedGroups'
import { Role } from '../model/Role'
import { User } from '../model/User'
import { UserBlocked } from '../model/UserBlocked'
import { UserReported } from '../model/UserReported'
import { DirectorApi } from '../server'
import { AcsService } from '../utils/AcsService'
import { DbManager } from '../utils/dbmanager'
import { randomString, validateAndFormatPhoneNumber, verifyAccess } from '../utils/utils'

export class RequestManager {
	private directorApiServer: DirectorApi
	private dbManager: DbManager

	constructor(directorApiServer: DirectorApi, dbManager: DbManager) {
		this.directorApiServer = directorApiServer
		this.dbManager = dbManager
	}

	public async odience(req: Request, res: Response) {
		const rawMsisdn: string = (req.query['msisdn'] ?? '') as string
		try {
			// const boolMobile: boolean = Boolean(
			//     parseInt(req.body.mobile, 10) || false
			// );
			let msisdn: string = rawMsisdn.replace(/\D/g, '')
			const countryCode: string = (req.query['country_code'] ?? '') as string

			const objValidateMsisdn = await validateAndFormatPhoneNumber(
				this.directorApiServer.getSettings(),
				msisdn,
				countryCode
			)

			if (objValidateMsisdn.valid && !objValidateMsisdn.error) {
				console.log('RequestManager.odience: msisdn was validated')
				msisdn = objValidateMsisdn.formatted
				// countryCode = objValidateMsisdn.country_code

				if (!msisdn) {
					return res.status(400).send('MSISDN: is empty')
				}

				const users: User[] | undefined = (await this.dbManager.fetchData('user', 'msisdn', msisdn, '*')) as User[]
				let user: User | undefined = users != undefined ? users[0] : undefined

				// KpiOdienceUserJob.dispatch(msisdn, req.ip, boolMobile);

				if (!user) {
					const salt = bcrypt.genSaltSync(10)
					const password = randomString(60)
					console.log('password generated:', password)
					const hashedPassword = bcrypt.hashSync(password, salt)
					const insertSuccess = await this.dbManager.insertData(
						'user',
						['msisdn', 'password', 'type', 'created_at', 'updated_at'],
						[
							msisdn,
							hashedPassword,
							'user',
							new Date().toISOString().replace('T', ' ').replace('Z', ''),
							new Date().toISOString().replace('T', ' ').replace('Z', ''),
						]
					)
					console.log('RequestManager.odience: user created?:', insertSuccess)
					const foundUsers = await this.dbManager.fetchData('user', 'msisdn', msisdn, '*')
					if (foundUsers && foundUsers.length > 0) {
						user = foundUsers[0] as User
					}
					console.log('RequestManager.odience: just created user: ', user)
				}
				console.log('RequestManager.odience: using user: ', user)

				const userId: string = user?.id + ''
				console.log('RequestManager.odience: userId: ', userId)
				const ownedGroups: OwnedGroups[] = (await this.dbManager.fetchData(
					'group',
					'owner_id',
					userId,
					'*'
				)) as OwnedGroups[]
				console.log('RequestManager.odience: ownedGroups: ', ownedGroups)

				if (ownedGroups.length === 0) {
					let group: Group | undefined = undefined
					const groups: Group[] = (await this.dbManager.fetchData(
						'group',
						'name',
						`PrivateGroup:[${user?.msisdn}]`,
						'*'
					)) as Group[]
					console.log('RequestManager.odience: group found: ', groups)
					if (!groups || groups.length === 0) {
						const insertSuccess = await this.dbManager.insertData(
							'group',
							['name', 'owner_id'],
							[`PrivateGroup:[${msisdn}]`, userId]
						)
						console.log('RequestManager.odience: Group created?:', insertSuccess)
						const groupFetched = await this.dbManager.fetchData('group', 'name', `PrivateGroup:[${user?.msisdn}]`, '*')
						if (groupFetched && groupFetched.length > 0) {
							group = groupFetched[0] as Group
						}
						console.log('RequestManager.odience: group:', group)
						// Insert roles for the new group
						const rolesToInsert = ['admin', 'manager', 'moderator']
						await Promise.all(
							rolesToInsert.map(async (role) => {
								const roleName = JSON.stringify({
									r: role,
									g: group?.id,
								})
								const insertRoleSuccess = await this.dbManager.insertData(
									'role',
									['name', 'guard_name'],
									[roleName, 'web']
								)
								console.log(`RequestManager.odience: insertRoleSuccess(${role})?: ${insertRoleSuccess}`)
							})
						)
					} else {
						group = groups[0]
						group = (await this.dbManager.updateData('group', 'id', String(group?.id), [
							{ owner_id: userId },
						])) as Group
						console.log('updated group, result ->', group)
					}

					const insertGroupUserSuccess = await this.dbManager.insertData(
						'group_user',
						['group_id', 'user_id'],
						[String(group?.id), userId]
					)
					console.log(`RequestManager.odience: insertGroupUserSuccess?: ${insertGroupUserSuccess}`)

					await this.dbManager.updateData('user', 'id', userId, [{ personal_group_id: group?.id }])
					let role = undefined
					const roleFound = await this.dbManager.fetchData(
						'role',
						'name',
						JSON.stringify({ r: 'admin', g: group?.id }),
						'*'
					)
					if (roleFound && roleFound.length > 0) {
						role = roleFound[0]
					}
					if (role) {
						this.dbManager.insertData(
							'model_has_role',
							['role_id', 'model_type', 'model_id'],
							[role.id, 'App\\Models\\User', userId]
						)
					}
				}

				console.log(
					'RequestManager.odience: user.otp_created_at: ',
					user?.otp_created_at,
					', ',
					user?.otp_created_at ? new Date(user.otp_created_at).getTime() : 'N/A'
				)
				console.log(
					'RequestManager.odience: Date.now           : ',
					new Date().toISOString(),
					', ',
					new Date().getTime()
				)
				if (user && (!user.otp_created_at || new Date(user?.otp_created_at).getTime() < new Date().getTime())) {
					console.log('RequestManager.odience: otp_created_at was done earlier or is undefined')
					const otp = randomString(60)
					console.log('OTP Created: ', otp)
					const salt = bcrypt.genSaltSync(8)
					const hashedOtp = bcrypt.hashSync(otp, salt)

					this.dbManager.updateData('user', 'id', String(user.id), [
						{ otp: hashedOtp },
						{ otp_created_at: new Date() },
						{ is_deleted: false },
						{ deleted_timestamp: null },
					])

					const acsService = new AcsService()
					let objResponse = await acsService.updateUser(user?.msisdn, otp, objValidateMsisdn.country_code)
					console.log('RequestManager.odience: updateUser result: ', objResponse)

					if (objResponse.code !== 200) {
						objResponse = await acsService.createUser(user?.msisdn, otp, objValidateMsisdn.country_code)
						console.log('RequestManager.odience: createUser result: ', objResponse)
					}

					return (objResponse.code || 0) !== 200
						? res.status(objResponse.code || 500).send(objResponse.message || '')
						: res.send(objResponse.message || '')
				} else {
					return res.status(403).send(`Provisioning limit reach for MSISDN: ${msisdn} (Retry later)`)
				}
			} else {
				console.log(objValidateMsisdn.valid, objValidateMsisdn.error)
				return res
					.status(400)
					.send(`Odience.index. validateMsisdn: ${msisdn} failed with error: ${objValidateMsisdn.error}`)
			}
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.error(`RequestManager.odience: for msisdn: ${rawMsisdn || ''}, error => ${error.message || ''}`)
			return res
				.status(500)
				.send(`Odience.index. msisdn: ${rawMsisdn || ''} failed with error: ${error.message || ''}`)
		}
	}

	public async getEventsList(req: Request, res: Response) {
		console.log(req, res)
	}

	public async getUserInfo(req: Request, res: Response) {
		console.log('RequestManager.getUserInfo:')
		if (req.headers.authorization) {
			const userId = await verifyAccess(req.headers.authorization)
			console.log('Jwt verify returned userId:', userId)
			const rows: RowDataPacket[] = (await this.dbManager.query('SELECT * FROM user WHERE id = ?', [
				userId,
			])) as RowDataPacket[]
			let user: User | undefined
			if (rows && rows.length > 0) {
				user = rows[0] as User
			} else {
				return res.status(401).json('User not found or not authenticated')
			}
			if (!user) {
				console.log('RequestManager.getUserInfo: Authorization failed')
				return res.status(401).json('User not found or not authenticated')
			}
			let usersReported: UserReported[] = []
			const rowsUsersReported: RowDataPacket[] = (await this.dbManager.query(
				'SELECT * FROM users_reported_by_users where user_id = ?',
				[userId]
			)) as RowDataPacket[]
			if (rowsUsersReported.length > 0) {
				usersReported = rowsUsersReported as UserReported[]
			}

			let usersBlocked: UserBlocked[] = []
			const rowsUsersBlocked: RowDataPacket[] = (await this.dbManager.query(
				'SELECT * FROM users_blocked_by_users where user_id = ?',
				[userId]
			)) as RowDataPacket[]
			if (rowsUsersBlocked.length > 0) {
				usersBlocked = rowsUsersBlocked as UserBlocked[]
			}

			let usersBlockedBy: UserBlocked[] = []
			const rowsUsersBlockedBy: RowDataPacket[] = (await this.dbManager.query(
				'SELECT * FROM users_blocked_by_users where blocked = ?',
				[user.msisdn]
			)) as RowDataPacket[]
			if (rowsUsersBlockedBy.length > 0) {
				usersBlockedBy = rowsUsersBlockedBy as UserBlocked[]
			}

			let superAdminRoleId: number | undefined = undefined
			const rowsRole: RowDataPacket[] = (await this.dbManager.query('SELECT * FROM role where name = ?', [
				JSON.stringify({ r: 'super-admin', g: null }),
			])) as RowDataPacket[]
			if (rowsRole && rowsRole.length > 0) {
				superAdminRoleId = (rowsRole[0] as Role).id
			}

			let hasSuperAdminRole: boolean = false
			if (superAdminRoleId) {
				const rowsRole: RowDataPacket[] = (await this.dbManager.query(
					'SELECT * FROM model_has_role where role_id = ? AND model_id = ?',
					[String(superAdminRoleId), userId]
				)) as RowDataPacket[]
				if (rowsRole && rowsRole.length > 0) {
					// Simply finding a row with role_id === superAdminRoleId and our userId means it has super_admin rights
					hasSuperAdminRole = true
				}
			}

			const userOrganizations: number[] = []
			const userOrganizationsRows: RowDataPacket[] = (await this.dbManager.query(
				'SELECT * FROM group_user where user_id = ?',
				[userId]
			)) as RowDataPacket[]
			if (userOrganizationsRows && userOrganizationsRows.length > 0) {
				(userOrganizationsRows as GroupUser[]).forEach((row: GroupUser) => {
					userOrganizations.push(row.group_id)
				})
			}

			const organizationsRole: Record<string, string[]> = {}
			const promises = userOrganizations.map(async (groupId: number) => {
				// This is garbage DB structure and very hard to manage, should be changed in the future
				console.log('Fetching roles for groupid: ', groupId)
				const rowAdminRole: RowDataPacket[] = (await this.dbManager.query('SELECT * FROM role where name = ?', [
					'{"r":"admin","g":' + groupId + '}',
				])) as RowDataPacket[]
				if (!organizationsRole[groupId]) {
					organizationsRole[groupId] = []
				}
				if (rowAdminRole && rowAdminRole.length > 0) {
					const roleAdminForGroup: Role = rowAdminRole[0] as Role
					const rowsRole: RowDataPacket[] = (await this.dbManager.query(
						'SELECT * FROM model_has_role where role_id = ? AND model_id = ?',
						[String(roleAdminForGroup.id), userId]
					)) as RowDataPacket[]
					if (rowsRole && rowsRole.length > 0) {
						organizationsRole[groupId].push('admin')
					}
				}
				const rowManagerRole: RowDataPacket[] = (await this.dbManager.query('SELECT * FROM role where name = ?', [
					'{"r":"manager","g":' + groupId + '}',
				])) as RowDataPacket[]
				if (rowManagerRole && rowManagerRole.length > 0) {
					const roleManagerForGroup: Role = rowAdminRole[0] as Role
					const rowsRole: RowDataPacket[] = (await this.dbManager.query(
						'SELECT * FROM model_has_role where role_id = ? AND model_id = ?',
						[String(roleManagerForGroup.id), userId]
					)) as RowDataPacket[]
					if (rowsRole && rowsRole.length > 0) {
						organizationsRole[groupId].push('manager')
					}
				}
				const rowModeratorRole: RowDataPacket[] = (await this.dbManager.query('SELECT * FROM role where name = ?', [
					'{"r":"moderator","g":' + groupId + '}',
				])) as RowDataPacket[]
				if (rowModeratorRole && rowModeratorRole.length > 0) {
					const roleModeratorForGroup: Role = rowAdminRole[0] as Role
					const rowsRole: RowDataPacket[] = (await this.dbManager.query(
						'SELECT * FROM model_has_role where role_id = ? AND model_id = ?',
						[String(roleModeratorForGroup.id), userId]
					)) as RowDataPacket[]
					if (rowsRole && rowsRole.length > 0) {
						organizationsRole[groupId].push('moderator')
					}
				}
				console.log('RequestManager.getUserInfo: organizations=', organizationsRole)
			})

			await Promise.all(promises)

			const body = JSON.stringify({
				user_id: user.id,
				group_id: user.personal_group_id,
				name: user.name,
				avatar: user.avatar_url,
				msisdn: user.msisdn,
				image_uid: user.image_uid,
				pns_settings: {
					//TODO: Fix those values, they are currently saved inside Redis, it should be moved to SQL
					pns_event_created: true,
					pns_event_updated: true,
					pns_event_registered: true,
					pns_event_mention: true,
				},
				usersReported: usersReported.map((user) => user.user_id),
				usersBlocked: usersBlocked.map((user) => user.blocked),
				usersBlockedBy: usersBlockedBy.map((user) => user.user_id),
				roles: {
					super_admin: hasSuperAdminRole,
					organizations: organizationsRole,
				},
			})
			res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
			res.setHeader('Pragma', 'no-cache')
			res.setHeader('Expires', '0')
			res.setHeader('Content-Type', 'application/json')
			return res.status(200).send(body)
		}
		return res.status(401).send('No Authorization header')
	}
}
