import { UserGroup } from "../../user-group/user-group.entity";
export class UserDto {
  id?: number;
  userName!: string;
  imagePath?: string;
  email!: string;
  password!: string;
  confirmPassword!: string;
  country!: string;
  group!: UserGroup;
  phoneNumber!: string;
  isVerify?: boolean;
}
