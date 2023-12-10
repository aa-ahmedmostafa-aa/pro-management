import { NextFunction, Response, Request } from "express";
import { logger } from "../services/logger.service";

export const globalErrorHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  process.on("unhandledRejection", (reason, promise) => {
    if (res.headersSent) {
      return;
    } else {
      logger.error(
        `🎃🎃 UnHandledRejection on ${promise} because ${reason} 🎃🎃`
      );
      return res.status(500).json({
        message: `${reason}`,
      });
    }
  });

  next();
};

export const uncaughtExceptionHandler = () => {
  process.on("uncaughtException", (error: Error) => {
    logger.error(`UncaughtException: ${error.stack}`);
  });
};
