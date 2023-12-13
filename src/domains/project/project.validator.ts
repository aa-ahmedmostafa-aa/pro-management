import { Request } from "express";
import { RequestBodyValidator } from "../../shared/services/request-body-validator";

export class ProjectValidator {
  public static validateCreateProject(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      title: "required|string",
      description: "required|string",
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
}
