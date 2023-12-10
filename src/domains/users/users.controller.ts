import { PasswordResettingService } from "./services/password-resetting.service";
import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import config from "../../../config";
import { StatusCodes } from "../../shared/enums/status-codes";
import { ErrorResponse } from "../../shared/models/error-response";
import { MessageResponse } from "../../shared/models/message-response";
import { IPaginatedRequest } from "../../shared/models/paginated-request";
import { ITokenClaim } from "../../shared/models/token-claim";
import { TokenResponse } from "../../shared/models/token-response";
import { UsersResponse } from "../../shared/models/users-response";
import { FileHandlingService } from "../../shared/services/files-saver.service";
import { HashingService } from "../../shared/services/hashing.service";
import { PaginationUtils } from "../../shared/services/pagination-utils.service";
import { ResponseHandlingService } from "../../shared/services/response-handling.service";
import { Role } from "../roles/roles.entity";
import { UserGroup } from "../user-group/user-group.entity";
import { UserGroupsService } from "../user-group/user-group.service";
import { UserLookups } from "./models/user-lookups";
import { UserLookupsVerificationResult } from "./models/user-lookups-verification-result";
import { UserDto } from "./models/user.dto";
import { UsersRequestDto } from "./models/users-request.dto";
import { UsersService } from "./services/users.service";
import { EmailsService } from "../../shared/services/email.service";
import { resetPasswordTemplate } from "../../shared/email-templates/reset-password.template";
import { verificationCodeTemplate } from "../../shared/email-templates/verification-code-template";
import { User } from "./entities/user.entity";
import { IUser } from "../../shared/models/user.dto";
import { UserValidator } from "./users.validator";
import { UserGroups } from "../../shared/models/user-groups";

export class UsersController {
  private readonly usersService: UsersService;
  private readonly fileHandlingService: FileHandlingService;
  private readonly hashingService: HashingService;
  private readonly userGroupsService: UserGroupsService;
  private readonly resetPasswordService: PasswordResettingService;
  private readonly emailService!: EmailsService;

  constructor() {
    this.usersService = new UsersService();
    this.fileHandlingService = new FileHandlingService();
    this.hashingService = new HashingService();
    this.userGroupsService = new UserGroupsService();
    this.resetPasswordService = new PasswordResettingService();
    this.emailService = new EmailsService();
  }

  async login(req: Request, res: Response) {
    try {
      const validationResult = UserValidator.validateLoginUser(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }

      const userInDb = await this.usersService.getUserByEmail(
        (req.body.email as string).toLowerCase()
      );
      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find user with email: ${req.body.email}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }
      const isValidPassword = await this.usersService.verifyUserPassword(
        req.body.password,
        userInDb.password
      );

      if (!isValidPassword) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(`Invalid password`, StatusCodes.UnAuthorized),
          StatusCodes.UnAuthorized
        );
      }

      if (!userInDb.isVerified) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Account not verified. Please check your email for a verification code.`,
            StatusCodes.UnAuthorized
          ),
          StatusCodes.UnAuthorized
        );
      }

      const userGroupForTheGivenUser = await this.userGroupsService.getGroup(
        userInDb.group.id
      );

      const token = this.usersService.provideToken(
        this.getUserClaims(userInDb, userGroupForTheGivenUser.roles)
      );

      return new ResponseHandlingService(
        res,
        new TokenResponse(token, config.TOKEN_EXPIRY_DURATION_IN_SECONDS),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async register(req: Request, res: Response) {
    return await this.userCreationSequence(req, res);
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const paginatedRequestMeta: IPaginatedRequest =
        PaginationUtils.getPaginationRequirementsFromRequest(req);

      const usersRequestDetails: UsersRequestDto = {
        pageNumber: paginatedRequestMeta.pageNumber,
        pageSize: paginatedRequestMeta.pageSize,
        userName: req.query.userName as string,
        email: req.query.email as string,
        country: req.query.country as string,
        groups: req.query.groups
          ? [...(req.query.groups as string[])]
              .filter((s) => s !== ",")
              .map((s) => parseInt(s))
          : [],
      };
      const usersInDb = await this.usersService.getAllUsers(
        usersRequestDetails
      );

      const usersToBeReturned = usersInDb[0].map((user: User) => {
        return new UsersResponse(user);
      });

      return new ResponseHandlingService(
        res,
        PaginationUtils.getPaginatedResponse(
          usersRequestDetails.pageNumber,
          usersRequestDetails.pageSize,
          usersToBeReturned,
          usersInDb[1]
        ),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async getCurrentUser(req: Request, res: Response) {
    try {
      const user = res.locals.user as IUser;
      const userInDb = await this.usersService.getUserById(user.userId);

      return new ResponseHandlingService(
        res,
        new UsersResponse(userInDb),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const userInDb = await this.usersService.getUserById(parseInt(id));

      return new ResponseHandlingService(
        res,
        new UsersResponse(userInDb || 0),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          error.message,
          StatusCodes.InternalServerError,
          error
        ),
        StatusCodes.InternalServerError
      );
    }
  }

  // used to create a user by the Admin of the system
  async createUser(req: Request, res: Response) {
    return await this.userCreationSequence(req, res, false);
  }

  async updateUser(req: Request, res: Response) {
    try {
      const validationResult = UserValidator.validateUpdateUser(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }

      const user = res.locals.user as IUser;
      const userInDb = await this.usersService.getUserById(user.userId);

      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find the requested user`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }
      const isValidPassword = await this.usersService.verifyUserPassword(
        req.body.confirmPassword,
        userInDb.password
      );

      if (!isValidPassword) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(`Invalid password`, StatusCodes.UnAuthorized),
          StatusCodes.UnAuthorized
        );
      }

      const isEmailExist = await this.usersService.getUserByEmail(
        (req.body.email as string).toLowerCase()
      );

      if (isEmailExist && isEmailExist.email !== userInDb.email) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `This email: ${req.body.email} already exists in the database.`,
            StatusCodes.Conflict
          ),
          StatusCodes.Conflict
        );
      }

      const isUserNameExist = await this.usersService.getUserByUserName(
        (req.body.userName as string).toLowerCase()
      );

      if (isUserNameExist && isUserNameExist.userName !== userInDb.userName) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `This username: ${req.body.userName} already exists in the database.`,
            StatusCodes.Conflict
          ),
          StatusCodes.Conflict
        );
      }

      const { files } = req;
      let filePath = "";

      if (files && files.profileImage) {
        filePath =
          userInDb.imagePath != ""
            ? await this.fileHandlingService.updateFile(
                files.profileImage as UploadedFile,
                userInDb.imagePath
              )
            : this.fileHandlingService.saveFile(
                files.profileImage as UploadedFile
              );
      }

      const userDto: UserDto = {
        userName: req.body.userName,
        imagePath: filePath || userInDb.imagePath,
        email: req.body.email,
        password: userInDb.password,
        confirmPassword: userInDb.password,
        country: req.body.country,
        phoneNumber: req.body.phoneNumber,
        group: userInDb.group,
      };

      const updatedUser = await this.usersService.updateUser(userDto, userInDb);

      return new ResponseHandlingService(
        res,
        new UsersResponse(updatedUser),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const validationResult = UserValidator.validateChangePassword(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const user = res.locals.user as IUser;

      const userInDb = await this.usersService.getUserById(user.userId);

      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `cannot find a user with ID: ${user.userId}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      if (
        !(await this.hashingService.verify(
          req.body.oldPassword,
          userInDb.password
        ))
      ) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(`Invalid password`, StatusCodes.BadRequest),
          StatusCodes.BadRequest
        );
      }

      await this.usersService.updateUserPassword(
        req.body.newPassword,
        userInDb
      );

      return new ResponseHandlingService(
        res,
        new MessageResponse("Password has been updated successfully"),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const userInDb = await this.usersService.getUserById(id);
      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a user with ID: ${id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      if (userInDb.group.name == UserGroups.Manager.name) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot delete admin account`,
            StatusCodes.BadRequest
          ),
          StatusCodes.BadRequest
        );
      }

      await this.usersService.deleteUser(id);

      return new ResponseHandlingService(
        res,
        new MessageResponse("The user has been deleted successfully"),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async toggleActivatedUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      const userInDb = await this.usersService.getUserById(id);
      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a user with ID: ${id}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      const user = await this.usersService.toggleActivateUser(userInDb);

      return new ResponseHandlingService(
        res,
        new UsersResponse(user),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async requestPasswordReset(req: Request, res: Response) {
    try {
      const validationResult = UserValidator.validateRequestResetPassword(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const { email } = req.body;

      const userInDb = await this.usersService.getUserByEmail(email);

      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a user with email: ${email}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      // check if the user has already requested to reset his password
      const userPreviousRequestInDb =
        await this.resetPasswordService.findResetRequestForUser(userInDb.id);

      // if the user has already requested a reset, remove the old one and add a new one.
      if (userPreviousRequestInDb) {
        await this.resetPasswordService.removeResetRequest(
          userPreviousRequestInDb.id
        );
      }

      const result = await this.resetPasswordService.addResetRequest(
        userInDb.id
      );
      // send the seed in an email.
      const resetPasswordEmailTemplate = resetPasswordTemplate(
        result.seed,
        userInDb.userName,
        config.PRODUCT_NAME,
        config.COMPANY_NAME,
        config.CONTACT_US_URL
      );

      await this.emailService.sendMail({
        to: email,
        from: config.SMTP_SENDER,
        subject: "Password Reset Request",
        html: resetPasswordEmailTemplate,
      });

      return new ResponseHandlingService(
        res,
        new MessageResponse(
          "Your request is being processed, please check your email"
        ),
        StatusCodes.Created
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const validationResult = UserValidator.validateResetPassword(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const { email, password, seed } = req.body;

      const userInDb = await this.usersService.getUserByEmail(email);

      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find a user with email: ${email}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }
      const resetPasswordRequestInDb =
        await this.resetPasswordService.findResetRequestForUser(userInDb.id);

      if (!resetPasswordRequestInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            "Cannot find any reset requests for you please try to reset again",
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      if (seed !== resetPasswordRequestInDb.seed) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            "Invalid verification code",
            StatusCodes.BadRequest
          ),
          StatusCodes.BadRequest
        );
      }

      await this.usersService.updateUserPassword(password, userInDb);

      await this.resetPasswordService.removeResetRequest(
        resetPasswordRequestInDb.id || 0
      );

      return new ResponseHandlingService(
        res,
        new MessageResponse("Password has been updated successfully"),
        StatusCodes.OK
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  private getUserClaims(user: User, roles: Role[]): ITokenClaim[] {
    return [
      {
        key: "userId",
        value: user.id,
      },
      {
        key: "roles",
        value: roles.map((m) => m.name),
      },
      {
        key: "userName",
        value: user.userName,
      },
      {
        key: "userEmail",
        value: user.email,
      },
      {
        key: "userGroup",
        value: user.group.name,
      },
    ];
  }

  private async userCreationSequence(
    req: Request,
    res: Response,
    isRegisterUserSequence: boolean = true
  ) {
    try {
      const validationResult = UserValidator.validateCreateUser(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const userInDb = await this.usersService.getUserByEmailOrUserName(
        (req.body.email as string).toLowerCase(),
        (req.body.userName as string).toLowerCase()
      );

      if (userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `The username or email already exists in the database.`,
            StatusCodes.Conflict
          ),
          StatusCodes.Conflict
        );
      }

      const { files } = req;
      let filePath = "";

      if (files && files.profileImage) {
        if (
          !this.fileHandlingService.isImageFile(
            files.profileImage as UploadedFile
          )
        ) {
          return new ResponseHandlingService(
            res,
            new ErrorResponse("File is not an image.", StatusCodes.BadRequest),
            StatusCodes.BadRequest
          );
        }

        filePath = this.fileHandlingService.saveFile(
          files.profileImage as UploadedFile
        );
      }

      const lookupValidationResult = await this.verifyLookups(
        new UserLookups(isRegisterUserSequence ? 2 : 1)
      );

      const userDto: UserDto = {
        userName: req.body.userName,
        email: req.body.email,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        group: isRegisterUserSequence
          ? this.addUserAsSystemUser()
          : lookupValidationResult.group || new UserGroup(),
        country: req.body.country,
        imagePath: filePath,
        phoneNumber: req.body.phoneNumber,
        isVerify: !isRegisterUserSequence,
      };
      const newUser = await this.usersService.createUser(userDto);

      if (isRegisterUserSequence) {
        await this.sendVerificationCode(newUser);

        return new ResponseHandlingService(
          res,
          new MessageResponse(
            "Account created successfully. A verification code has been sent to your email address."
          ),
          StatusCodes.Created
        );
      }

      return new ResponseHandlingService(
        res,
        new UsersResponse(newUser),
        StatusCodes.Created
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }

  private async verifyLookups(userLookups: UserLookups) {
    const result: UserLookupsVerificationResult = {};

    result.group = await this.userGroupsService.getGroup(userLookups.group);

    for (const lookup in result) {
      if (!result[lookup as keyof UserLookupsVerificationResult]) {
        throw new Error(`Cannot find ${lookup} with the provided id`);
      }
    }

    return result;
  }

  private addUserAsSystemUser(): UserGroup {
    const systemUserGroup = new UserGroup();
    systemUserGroup.id = 2;
    return systemUserGroup;
  }

  private async sendVerificationCode(user: User) {
    await this.usersService.updateVerificationCode(user);
    // send the verification code email.
    const verificationCodeEmailTemplate = verificationCodeTemplate(
      user.userName,
      user.verificationCode,
      config.PRODUCT_NAME,
      config.COMPANY_NAME,
      config.CONTACT_US_URL
    );

    await this.emailService.sendMail({
      to: user.email,
      from: config.SMTP_SENDER,
      subject: "Account Verification Code",
      html: verificationCodeEmailTemplate,
    });
  }

  public async verifyAccount(req: Request, res: Response) {
    const { email, code } = req.body;
    try {
      const validationResult = UserValidator.validateVerifyAccount(req);
      if (!validationResult.status) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            validationResult.errorMessage,
            StatusCodes.BadRequest,
            validationResult.error
          ),
          StatusCodes.BadRequest
        );
      }
      const userInDb = await this.usersService.getUserByEmail(
        (email as string).toLowerCase()
      );
      if (!userInDb) {
        return new ResponseHandlingService(
          res,
          new ErrorResponse(
            `Cannot find user with email: ${req.body.email}`,
            StatusCodes.NotFound
          ),
          StatusCodes.NotFound
        );
      }

      // Compare the provided code with the saved verification code
      if (userInDb.verificationCode == code) {
        await this.usersService.verifyUser(userInDb);
        return new ResponseHandlingService(
          res,
          new MessageResponse("Account verified successfully"),
          StatusCodes.OK
        );
      }
      return new ResponseHandlingService(
        res,
        new ErrorResponse(`Invalid verification code`, StatusCodes.BadRequest),
        StatusCodes.BadRequest
      );
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  }
}
