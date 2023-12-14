import { Request } from "express";
import { RequestBodyValidator } from "../../shared/services/request-body-validator";

export class TaskValidator {
  public static validateCreateTask(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      title: "required|string",
      description: "required|string",
      projectId: "required|integer",
      employeeId: "required|integer",
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

  public static validateUpdateTask(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      title: "required|string",
      description: "required|string",
      employeeId: "required|integer",
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

  public static validateChangeStatus(req: Request) {
    const validationResult = {
      status: true,
      error: null,
      errorMessage: "Error on validating your request",
    };
    const validationRules = {
      status: "required|in:ToDo,InProgress,Done",
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
