import { Repository } from "typeorm"
import { AppDataSource } from "../data-source"
import { User } from "../entity/User"
import { UserGroupRoles } from "../entity/UserGroupRoles"
import { Group } from "../entity/Group"
import { Role } from "../entity/Role"
import { GroupUser } from "../entity/GroupUser"
import { capitalize } from "../utils/utils"

export class GroupService {
	private userRepository: Repository<User>
	private groupRepository: Repository<Group>
	private roleRepository: Repository<Role>
	private groupUserRepository: Repository<GroupUser>
	private userGroupRolesRepository: Repository<UserGroupRoles>

	constructor() {
		this.userRepository = AppDataSource.getRepository(User)
		this.roleRepository = AppDataSource.getRepository(Role)
		this.groupRepository = AppDataSource.getRepository(Group)
		this.groupUserRepository = AppDataSource.getRepository(GroupUser)
		this.userGroupRolesRepository = AppDataSource.getRepository(UserGroupRoles)
	}

	async setupPersonalGroup(user: User): Promise<any> {
		try {
			let group = null
			if(user.personal_group_id != null)
			{
				group = await this.groupRepository.findOneBy({id: user.personal_group_id})
				if(group)
				{
					group.owner_id = user.id
					group = await this.groupRepository.save(group)
					await this.associateOwnerGroup(group, user)
				}
			}
			const currentUser = await this.userRepository.findOne({
				where: { id: user.id },
				relations: ["ownedGroups"],
			})
			const ownedGroups = currentUser?.ownedGroups || []
			if(ownedGroups.length == 0)
			{
				group = await this.groupRepository.findOneBy({name: `PrivateGroup:[${user.msisdn}]`})
				if(!group)
				{
					let name =  `PrivateGroup:[${user.msisdn}]`
					if(user.name)
					{
						name = capitalize(String(user.name)) + "'s Organization"
					}

					const newGroup = new Group()
					newGroup.name = name
					newGroup.owner_id = user.id
					group = await this.groupRepository.save(newGroup)
					await this.associateOwnerGroup(group, user)
				}
				else
				{
					let name =  `PrivateGroup:[${user.msisdn}]`
					if(user.name)
					{
						name = capitalize(String(user.name)) + "'s Organization"
					}
					group.name = name
					group = await this.groupRepository.save(group)
					await this.associateOwnerGroup(group, user)
				}
			}
		}
		catch (error) {
			console.log(error)
			return null
		}
	}

	async associateOwnerGroup(group: Group, user: User): Promise<Group>
	{
		user.personal_group_id = group.id
		await this.userRepository.save(user)
		const groupUser = await this.groupUserRepository.findOneBy({group_id: group.id, user_id: user.id})
		if(!groupUser)
		{
			const newGroupUser = new GroupUser()
			newGroupUser.user_id = user.id
			newGroupUser.group_id = group.id
			await this.groupUserRepository.save(newGroupUser)
			await this.assignGroupRole(group, user, Role.ROLE_ADMIN)
		}
		return group
	}

	async assignGroupRole(group: Group, user: User, roleName: string): Promise<void>
	{
		const role = await this.roleRepository.findOneBy({name: roleName})
		if(role)
		{
			const userRoleGroup = await this.userGroupRolesRepository.findOneBy(
				{ role_id: role.id, user_id: user.id, group_id:  group.id})
			if(!userRoleGroup)
			{
				console.log(`Role ${roleName} assigned to a user ${user.id}`)
				const userRoleGroup = new UserGroupRoles()
				userRoleGroup.user_id = user.id
				userRoleGroup.group_id = group.id
				userRoleGroup.role_id = role.id
				await this.userGroupRolesRepository.save(userRoleGroup)
			}
		}
	}
}
