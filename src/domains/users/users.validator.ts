import { Request } from "express";
import { RequestBodyValidator } from "../../shared/services/request-body-validator";

export class UserValidator {
  static passwordExpression: RegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  static invalidPasswordRegexMsg =
    "The password must include at least one lowercase letter, one uppercase letter, one digit, one special character, and be at least 6 characters long.";
  static usernameExpression: RegExp = /^[A-Za-z]+[0-9]+$/;
  static invalidUserNameRegexMsg =
    "The userName must contain characters and end with numbers without spaces.";

  public static validateVerifyAccount(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      email: "required|email",
      code: "required|string",
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      }
    );

    return validationResult;
  }

  public static validateLoginUser(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      email: "required|email",
      password: "required",
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      }
    );

    return validationResult;
  }

  public static validateChangePassword(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      oldPassword: "required|string",
      confirmNewPassword: "required|same:newPassword",
      newPassword: ["required", `regex:${this.passwordExpression}`],
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      },
      { regex: this.invalidPasswordRegexMsg }
    );

    return validationResult;
  }

  public static validateRequestResetPassword(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      email: "required|email",
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      }
    );

    return validationResult;
  }

  public static validateResetPassword(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      email: "required|email",
      seed: "required|string",
      password: ["required", `regex:${this.passwordExpression}`],
      confirmPassword: "required|same:password",
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      },
      { regex: this.invalidPasswordRegexMsg }
    );

    return validationResult;
  }

  public static validateCreateUser(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      userName: [
        "required",
        "min:4",
        "max:8",
        `regex:${this.usernameExpression}`,
      ],
      email: "required|email",
      country: "required|string",
      phoneNumber: "required|string",
      password: ["required", `regex:${this.passwordExpression}`],
      confirmPassword: "required|same:password",
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      },
      {
        "regex.password": this.invalidPasswordRegexMsg,
        "regex.userName": this.invalidUserNameRegexMsg,
      }
    );

    return validationResult;
  }

  public static validateUpdateUser(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      userName: [
        "required",
        "min:4",
        "max:8",
        `regex:${this.usernameExpression}`,
      ],
      email: "required|email",
      country: "required|string",
      phoneNumber: "required|string",
      confirmPassword: ["required", `regex:${this.passwordExpression}`],
    };
    RequestBodyValidator.validateWithRules(
      req.body,
      validationRules,
      (err: any, status: boolean) => {
        validationResult.error = err;
        validationResult.status = status;
      },
      {
        "regex.password": this.invalidPasswordRegexMsg,
        "regex.userName": this.invalidUserNameRegexMsg,
      }
    );

    return validationResult;
  }
}
