import { UserRoles } from "../../shared/models/user-roles";
import { UserGroup } from "../../domains/user-group/user-group.entity";
import { HashingService } from "../../shared/services/hashing.service";
import { Role } from "../../domains/roles/roles.entity";
import { DataSourceOptions, DataSource, Db } from "typeorm";
import config from "../../../config";
import { UserGroups } from "../../shared/models/user-groups";
import { User } from "../../domains/users/entities/user.entity";

const connectOptions: DataSourceOptions = {
  type: "postgres",
  ...(config.NODE_ENV === "production" || config.NODE_ENV === "prod"
    ? {
        url: config.CONNECTION_STRING_DB,
        ssl: true,
      }
    : {
        host: config.DB_HOST,
        port: config.DB_PORT,
        database: config.DB_INSTANCE,
        username: config.DB_USERNAME,
        password: config.DB_PASSWORD,
      }),
  entities: ["src/domains/**/*.entity{.ts,.js}"],
  migrations: ["src/config/db/migrations/*.ts"],
  synchronize: true,
};

export const DB = new DataSource(connectOptions);

export const initDB = async () => {
  const db = !DB.isInitialized ? await DB.initialize() : DB;

  return db;
};

export const initDBWithData = async () => {
  const db = !DB.isInitialized ? await DB.initialize() : DB;

  // await clearDB();
  const userRolesKeys = Object.keys(UserRoles);

  for (const role in UserRoles) {
    const newRole = new Role();
    newRole.name = (UserRoles as any)[role].name;
    await db.manager.save(newRole);
  }

  await seedUserGroup(UserGroups.Manager.name, [
    UserRoles.Manager.id,
    UserRoles.canAddUser.id,
    UserRoles.canUpdateUser.id,
    UserRoles.canDeleteUser.id,
    UserRoles.canGetUserById.id,
    UserRoles.canGetCurrentUser.id,
    UserRoles.canGetAllUsers.id,
    UserRoles.canChangePassword.id,
  ]);

  await seedUserGroup(UserGroups.Employee.name, [
    UserRoles.Employee.id,
    UserRoles.canUpdateUser.id,
    UserRoles.canGetCurrentUser.id,
    UserRoles.canChangePassword.id,
  ]);

  await seedUsersForesting("manager", 1);
  await seedUsersForesting("employee", 2);

  return db;
};

const seedUserGroup = async (userGroupName: string, roles: number[]) => {
  const userGroup = new UserGroup();
  userGroup.name = userGroupName;

  const rolesSet = new Set<number>(roles);

  roles = Array.from(rolesSet);

  userGroup.roles = roles.map((r) => {
    const role = new Role();
    role.id = r;
    return role;
  });

  return await DB.manager.save(userGroup);
};

const seedUsersForesting = async (userName: string, userGroupId: number) => {
  const user = new User();
  user.userName = userName;
  user.email = `${userName}@email.com`.toLowerCase();
  user.country = "Egypt";
  user.phoneNumber = "01201824248";
  user.isVerified = true;

  const userGroup = new UserGroup();
  userGroup.id = userGroupId;
  user.group = userGroup;

  const hashingService = new HashingService();
  user.password = await hashingService.hash("@Password123!");

  return await DB.manager.save(user);
};

export const clearDB = async () => {
  const entities = DB.entityMetadatas;
  for (const entity of entities) {
    const repository = DB.getRepository(entity.name);
    await repository.query(
      `TRUNCATE "${entity.tableName}" RESTART IDENTITY CASCADE;`
    );
  }
};

export const dropDB = async () => {
  await DB.destroy();
};
