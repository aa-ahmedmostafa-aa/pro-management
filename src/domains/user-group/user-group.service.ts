import { GenericRepository } from "./../../shared/repository/implementations/generic-repository";
import { UserGroup } from "./user-group.entity";
import { IGenericRepository } from "./../../shared/repository/abstractions/generic-repository";
import { AddOrUpdateUserGroupDto } from "./models/add-or-update-user-group.dto";
import { Role } from "../roles/roles.entity";

export class UserGroupsService {
  private readonly userGroupsRepository: IGenericRepository<UserGroup>;

  constructor() {
    this.userGroupsRepository = new GenericRepository(UserGroup);
  }

  async getAllGroups() {
    return this.userGroupsRepository.findLookup({
      name: true,
      id: true,
    });
  }

  async getGroup(userGroupId: number) {
    return this.userGroupsRepository.findOne({
      where: {
        id: userGroupId,
      },
      relations: {
        roles: true,
      },
    });
  }

  async addGroup(userGroupDto: AddOrUpdateUserGroupDto) {
    const newUserGroup = new UserGroup();
    newUserGroup.name = userGroupDto.name;
    newUserGroup.roles = userGroupDto.roles.map((m) => {
      const role = new Role();
      role.id = m;
      return role;
    });

    return this.userGroupsRepository.create(newUserGroup);
  }

  async updateGroup(
    userGroupDto: AddOrUpdateUserGroupDto,
    userGroupInDb: UserGroup
  ) {
    userGroupInDb.name = userGroupDto.name;
    userGroupInDb.roles = userGroupDto.roles.map((m) => {
      const role = new Role();
      role.id = m;
      return role;
    });

    return await this.userGroupsRepository.update(userGroupInDb);
  }

  async deleteGroup(userGroupId: number) {
    return this.userGroupsRepository.delete(userGroupId);
  }
}
