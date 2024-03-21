import { Repository } from "typeorm"
import { Request, Response } from "express"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { AcsService } from "./AcsService"
import { validateAndFormatPhoneNumber, randomString } from "../utils/utils"
import * as bcrypt from "bcryptjs"
import { UserService } from "./UserService"
import { GroupService } from "./GroupService"

export class OdienceService {
	private userRepository: Repository<User>
	private userService = new UserService()
	private groupService = new GroupService()

	constructor() {
		this.userRepository = AppDataSource.getRepository(User)
	}

	async provisionUser (req: Request, res: Response, rawMsisdn: string): Promise<any> {
		// const boolMobile: boolean = Boolean(
		//     parseInt(req.body.mobile, 10) || false
		// );
		let msisdn: string = rawMsisdn.replace(/\D/g, "")
		const countryCode: string = (req.query["country_code"] ?? "") as string

		const objValidateMsisdn = await validateAndFormatPhoneNumber(
			msisdn,
			countryCode
		)

		if (objValidateMsisdn.valid && !objValidateMsisdn.error) {
			console.log("OdienceService.provisionUser: msisdn was validated")
			msisdn = objValidateMsisdn.formatted
			// countryCode = objValidateMsisdn.country_code
			if (!msisdn) {
				return {code: 400, message: "MSISDN: is empty"}
			}

			let user = await this.userRepository.findOneBy({msisdn: msisdn})
			// KpiOdienceUserJob.dispatch(msisdn, req.ip, boolMobile);
			if (!user) {
				user = await this.userService.createNewRegisteredUser(msisdn)
				if(!user)
				{
					console.log("OdienceService.provisionUser: user created?:", user != null)
					return {code: 500, message: "OdienceService.provisionUser: Failed to create a user"}
				}
				console.log("OdienceService.provisionUser: just created user: ", user)
			}
			console.log("OdienceService.provisionUser: using user: ", user)

			await this.groupService.setupPersonalGroup(user)
			user = await this.userRepository.findOneBy({msisdn: msisdn})
			console.log(
				"OdienceService.provisionUser: user.otp_created_at: ",
				user?.otp_created_at,
				", ",
				user?.otp_created_at ? new Date(user.otp_created_at).getTime() : "N/A"
			)
			console.log(
				"OdienceService.provisionUser: Date.now           : ",
				new Date().toISOString(),
				", ",
				new Date().getTime()
			)
			if (user && (!user?.otp_created_at || new Date(user?.otp_created_at).getTime() < new Date().getTime())) {
				console.log("OdienceService.provisionUser: otp_created_at was done earlier or is undefined")
				const otp = randomString(60)
				console.log("OTP Created: ", otp)
				const salt = bcrypt.genSaltSync(8)
				const hashedOtp = bcrypt.hashSync(otp, salt)

				user.otp = hashedOtp
				user.otp_created_at = new Date()
				user.is_deleted = 0
				user.deleted_timestamp =  null

				user = await this.userRepository.save(user)
				const acsService = new AcsService()
				let objResponse = await acsService.updateUser(user.msisdn, otp, objValidateMsisdn.country_code)
				console.log("OdienceService.provisionUser: updateUser result: ", objResponse)

				if (objResponse.code !== 200) {
					objResponse = await acsService.createUser(user.msisdn, otp, objValidateMsisdn.country_code)
					console.log("OdienceService.provisionUser: createUser result: ", objResponse)
				}
				return objResponse
			}else
			{
				console.log(objValidateMsisdn.valid, objValidateMsisdn.error)
				return {code: 403, message: `OdienceService.provisionUser validateMsisdn: ${msisdn} failed with error: ${objValidateMsisdn.error}`}
			}

		}else
		{
			return {code: 400, message: `OdienceService.provisionUser validateMsisdn: ${msisdn} failed with error: ${objValidateMsisdn.error}`}
		}
	}
}
