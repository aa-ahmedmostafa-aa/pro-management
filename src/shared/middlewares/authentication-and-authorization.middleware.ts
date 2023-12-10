import { ErrorResponse } from "./../models/error-response";
import { MessageResponse } from "./../models/message-response";
import { JwtService } from "./../services/jwt.service";
import { StatusCodes } from "./../enums/status-codes";
import { NextFunction, Request, Response } from "express";
import { ResponseHandlingService } from "../services/response-handling.service";

export const authenticationAndAuthorizationMiddleware = (role: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const jwtService = new JwtService();
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return new ResponseHandlingService(
          res,
          new MessageResponse("unAuthorized"),
          StatusCodes.UnAuthorized
        );
      }

      const decodedToken = jwtService.verify(token);
      const userRoles = decodedToken.roles;

      if (!userRoles || userRoles.length == 0) {
        return new ResponseHandlingService(
          res,
          new MessageResponse("Access Denied"),
          StatusCodes.Forbidden
        );
      }
      let userHasAccess = false;

      const userRolesSet = new Set(userRoles);

      for (const expectedRoles of role) {
        if (userRolesSet.has(expectedRoles)) {
          userHasAccess = true;
          break;
        }
      }

      if (userHasAccess) {
        res.locals.user = {
          userName: decodedToken.username,
          userEmail: decodedToken.userEmail,
          userId: decodedToken.userId,
          userGroup: decodedToken.userGroup,
        };
        next();
      } else {
        return res
          .status(StatusCodes.Forbidden)
          .send(new MessageResponse("Access Denied"));
      }
    } catch (error: any) {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(error.any, StatusCodes.InternalServerError, error),
        StatusCodes.InternalServerError
      );
    }
  };
};
