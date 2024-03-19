import * as bcrypt from 'bcryptjs'
import { Request, Response } from 'express'
import { Group } from '../model/Group'
import { OwnedGroups } from '../model/OwnedGroups'
import { User } from '../model/User'
import { DirectorApi } from '../server'
import { AcsService } from '../utils/AcsService'
import { DbManager } from '../utils/dbmanager'
import { randomString, validateAndFormatPhoneNumber } from '../utils/utils'

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
						group = (await this.dbManager.updateData('group', 'id', String(group?.id), [{ owner_id: userId }])) as Group
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
			return res.status(500).send(`Odience.index. msisdn: ${rawMsisdn || ''} failed with error: ${error.message || ''}`)
		}
	}

	public async getEventsList(req: Request, res: Response) {
		console.log(req, res)
	}
}
