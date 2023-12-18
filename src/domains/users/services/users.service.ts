import { randomBytes } from "crypto";
import { ITokenClaim } from "../../../shared/models/token-claim";
import { IGenericRepository } from "../../../shared/repository/abstractions/generic-repository";
import { GenericRepository } from "../../../shared/repository/implementations/generic-repository";
import { HashingService } from "../../../shared/services/hashing.service";
import { JwtService } from "../../../shared/services/jwt.service";
import { UserGroup } from "../../user-group/user-group.entity";
import { User } from "../entities/user.entity";
import { UserDto } from "../models/user.dto";
import { UsersRequestDto } from "../models/users-request.dto";
import { UsersFiltrationService } from "./users-filtration.service";
import { IRelationFiltrationOptions } from "../../../shared/models/relation-filtration-options";

export class UsersService {
  private readonly usersRepository: IGenericRepository<User>;
  private readonly hashingService: HashingService;
  private readonly jwtService: JwtService;
  private readonly usersFiltrationService: UsersFiltrationService;

  constructor() {
    this.usersRepository = new GenericRepository(User);
    this.hashingService = new HashingService();
    this.jwtService = new JwtService();
    this.usersFiltrationService = new UsersFiltrationService();
  }

  async getAllUsers(usersRequest: UsersRequestDto) {
    const limit = usersRequest.pageSize;
    const skipBy = (usersRequest.pageNumber - 1) * limit;

    const searchQuery =
      this.usersFiltrationService.buildUsersFilterQuery(usersRequest);

    const findOptions: IRelationFiltrationOptions = {
      where: searchQuery,
      skip: skipBy,
      take: limit,
      orderBy: { "user.creationDate": "DESC" },
      queryBuilderCreationPropertyName: "user",
      tableRelations: this.usersFiltrationService.getUsersRelationsProperties(),
      relationFiltration:
        this.usersFiltrationService.buildUsersComplexFilters(usersRequest),
    };
    return await this.usersRepository.findQueryBuilderAndCount(findOptions);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        email,
      },
      relations: {
        group: true,
      },
    });
  }

  async getUserByUserName(userName: string): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        userName,
      },
    });
  }

  async getUserByEmailOrUserName(
    email: string,
    userName: string
  ): Promise<User> {
    return await this.usersRepository.findOne({
      where: [{ userName }, { email }],
      relations: {
        group: true,
      },
    });
  }

  async verifyUserPassword(
    providedPassword: string,
    existingPassword: string
  ): Promise<boolean> {
    return await this.hashingService.verify(providedPassword, existingPassword);
  }

  public provideToken(tokenClaims: ITokenClaim[]): string {
    return this.jwtService.sign(tokenClaims);
  }

  async createUser(userDto: UserDto) {
    const newUser = new User();
    newUser.userName = userDto.userName.toLowerCase();
    newUser.email = userDto.email.toLowerCase();
    newUser.password = await this.hashingService.hash(userDto.password);
    newUser.group = userDto.group;
    newUser.country = userDto.country.toLowerCase();
    newUser.phoneNumber = userDto.phoneNumber;

    if (userDto.imagePath) newUser.imagePath = userDto.imagePath;
    if (userDto.isVerify) newUser.isVerified = userDto.isVerify;
    return await this.usersRepository.create(newUser);
  }

  async updateUser(userDto: UserDto, existingUser: User) {
    existingUser.userName = userDto.userName.toLowerCase();
    existingUser.email = userDto.email.toLowerCase();
    existingUser.password = userDto.password;
    existingUser.group = userDto.group;
    existingUser.country = userDto.country.toLowerCase();
    existingUser.phoneNumber = userDto.phoneNumber;
    if (userDto.imagePath) existingUser.imagePath = userDto.imagePath;

    return await this.usersRepository.update(existingUser);
  }

  async updateUserPassword(newPassword: string, existingUser: User) {
    existingUser.password = await this.hashingService.hash(newPassword);
    return await this.usersRepository.update(existingUser);
  }

  async deleteUser(userId: number) {
    return await this.usersRepository.delete(userId);
  }

  async toggleActivateUser(userInDb: User) {
    userInDb.isActivated = !userInDb.isActivated;
    return await this.usersRepository.update(userInDb);
  }

  async getUserById(id: number): Promise<User> {
    return await this.usersRepository.findOne({
      where: {
        id,
      },
      relations: {
        group: true,
      },
    });
  }

  async getUserByIdAndGroupId(id: number, groupId: number): Promise<User> {
    const group = new UserGroup();
    group.id = groupId;
    return await this.usersRepository.findOne({
      where: {
        id,
        group,
      },
      selectedColumns: {
        id: true,
        name: true,
        imagePath: true,
        bio: true,
      },
    });
  }

  async updateVerificationCode(existingUser: User) {
    existingUser.verificationCode = randomBytes(2).toString("hex");
    return await this.usersRepository.update(existingUser);
  }

  async verifyUser(existingUser: User) {
    existingUser.isVerified = true;
    return await this.usersRepository.update(existingUser);
  }

  async getUsersCountByManagerId(managerId: number) {
    // Find the manager by ID along with the associated projects and tasks
    return await this.usersRepository.findOne({
      where: { id: managerId },
      relations: ["project", "project.task", "project.task.employee"],
    });
  }
}
