import * as bcrypt from "bcryptjs"
import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { Role } from "../entity/Role"
import { User } from "../entity/User"
import { UserGroupRoles } from "../entity/UserGroupRoles"
import { randomString } from "../utils/utils"
import { $ } from "bun"

export class UserService {
  private userRepository: Repository<User>
  private userGroupRolesRepository: Repository<UserGroupRoles>

  constructor() {
    this.userRepository = AppDataSource.getRepository(User)
    this.userGroupRolesRepository = AppDataSource.getRepository(UserGroupRoles)
  }

  async getUserInfo(userId: number): Promise<any> {
    const reportedUsers = []
    let boolSuperAdmin = false
    let orgRoles: { [key: number]: string[] } = {}
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ["usersReported", "usersBlocked", "usersBlockedBy", "roles"], // Load the related usersReported
      })

      if (!user) {
        return null
      } else {
        //get reported users
        const reportedUsersObjects = user.usersReported || []
        reportedUsers.push(...reportedUsersObjects.map((reportedUser) => reportedUser.reported))

        //get blocked users
        const blockedUsersObjects = user.usersBlocked || []
        const blockedUsers = await Promise.all(
          blockedUsersObjects.map(async (user) => {
            const userBlocked = await this.userRepository.findOne({
              where: { msisdn: user.blocked },
            })
            return userBlocked ? {id: userBlocked.msisdn, name: userBlocked.name, avatar: userBlocked.avatar_url, sip: `+${userBlocked.msisdn}`, type: "user"} : null
          })
        )

        //get users blocked by
        const blockedByUsersObjects = user.usersBlockedBy || []
        const blockedByUsers = await Promise.all(
          blockedByUsersObjects.map(async (blocked) => {
            const blockedUser = await this.userRepository.findOne({
              where: { id: blocked.user_id },
            })
            return blockedUser ? blockedUser.msisdn : null
          })
        )

        //get user roles with org id if super admin org roles is empty
        const userRolesObject = user.roles || []
        const userRoles = await Promise.all(
          userRolesObject.map(async (role) => {
            const roleGroupObject = await this.userGroupRolesRepository.findOne({
              where: { role_id: role.id, user_id: userId },
            })
            return roleGroupObject ? { groupId: roleGroupObject.group_id, name: role.name } : null
          })
        )
        userRoles.forEach((groupRole) => {
          if (boolSuperAdmin || !groupRole) {
            return
          }
          if (groupRole.name == Role.ROLE_SUPER_ADMIN) {
            boolSuperAdmin = true
            orgRoles = {}
            return
          }
          if (groupRole.groupId == null) {
            return
          }
          const groupId = groupRole.groupId
          if (!orgRoles[groupId]) {
            orgRoles[groupId] = []
          }
          orgRoles[groupId].push(groupRole.name)
        })

        const result = {
          user_id: user.id,
          group_id: user.personal_group_id,
          name: user.name,
          avatar: user.avatar_url,
          msisdn: user.msisdn,
          image_uid: user.image_uid,
          account_type: user.account_type,
          pns_settings: {
            //TODO: Fix those values, they are currently saved inside Redis, it should be moved to SQL
            pns_event_created: true,
            pns_event_updated: true,
            pns_event_registered: true,
            pns_event_mention: true,
          },
          usersReported: reportedUsers,
          usersBlocked: blockedUsers,
          usersBlockedBy: blockedByUsers,
          roles: {
            super_admin: boolSuperAdmin,
            organizations: orgRoles,
          },
        }

        return result
      }
    } catch (error) {
      console.log(error)
      return null
    }
  }
  async getUserInfoByMsisdn(msisdn: string): Promise<{id: string, sip: string, role: string, avatar: string, type: string, name: string} | null>
  {
    const user = await this.userRepository.findOne({
      where: { msisdn: msisdn }})
    return !user ? null :{id: String(msisdn), name: String(user.name), avatar: String(user.avatar_url), type: "standard", role: "user", sip: `+${msisdn}`}
  }

  async createNewRegisteredUser(msisdn: string): Promise<User | null> {
    const salt = bcrypt.genSaltSync(10)
    const password = randomString(60)
    console.log("password generated:", password)
    const hashedPassword = bcrypt.hashSync(password, salt)
    const newUser = new User()
    newUser.msisdn = msisdn
    newUser.password = hashedPassword
    newUser.type = "user"
    newUser.created_at = new Date()
    newUser.updated_at = new Date()
    return await this.userRepository.save(newUser)
  }
}
