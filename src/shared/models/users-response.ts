import { UserGroup } from "./../../domains/user-group/user-group.entity";
import { User } from "../../domains/users/entities/user.entity";

export class UsersResponse {
  id?: number;
  userName: string;
  imagePath: string;
  creationDate: Date;
  modificationDate: Date;
  email: string;
  group!: UserGroup;
  country!: string;
  phoneNumber!: string;
  isActivated!: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.userName = user.userName;
    this.email = user.email;
    this.country = user.country;
    this.phoneNumber = user.phoneNumber;
    this.imagePath = user.imagePath;
    this.isActivated = user.isActivated;
    this.group = user.group;
    this.creationDate = user.creationDate;
    this.modificationDate = user.modificationDate;
  }
}
