import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import { applicationRoutes } from "./routes/index";
import { initDB, initDBWithData } from "./config/db/index";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "./../swagger";
import config from "../config";
import { morganMiddleware } from "./shared/middlewares/morgan.middleware";
import {
  globalErrorHandler,
  uncaughtExceptionHandler,
} from "./shared/middlewares/global-error-handler";
import morgan from "morgan";
import { ResponseHandlingService } from "./shared/services/response-handling.service";
import { StatusCodes } from "./shared/enums/status-codes";
import { ErrorResponse } from "./shared/models/error-response";
import https from "https";
import fs from "fs";

const port = config.PORT || 3000;

export class Server {
  public express: Application;

  constructor() {
    this.express = express();
    this.configuration();
    this.express.use(applicationRoutes);
    this.express.use(
      "/docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerDocument)
    );

    this.express.all("*", (req: Request, res: Response) => {
      return new ResponseHandlingService(
        res,
        new ErrorResponse(
          `Can not find this route: ${req.originalUrl}`,
          StatusCodes.NotFound
        ),
        StatusCodes.NotFound
      );
    });

    initDBWithData()
      .then(() =>
        console.log(
          `${config.DB_INSTANCE} initialized successfully on ${config.NODE_ENV}`
        )
      )
      .catch((err) => console.log(err));

    this.express.use(morganMiddleware);
  }

  public configuration() {
    uncaughtExceptionHandler();
    this.express.use(globalErrorHandler);
    this.express.use(morgan("dev"));
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.static("./"));
  }

  public start() {
    // if (config.NODE_ENV == "prod") {
    //   const credentials = {
    //     key: fs.readFileSync("/root/certs/privkey.pem", "utf-8"),
    //     cert: fs.readFileSync("/root/certs/cert.pem", "utf-8"),
    //   };

    //   const httpsServer = https.createServer(credentials, this.express);
    //   httpsServer.listen(port, () => {
    //     console.log(
    //       `Server started at https://localhost:${port} on ${config.NODE_ENV}`
    //     );
    //   });
    // }

    this.express.listen(port, () => {
      console.log(
        `Server started at http://localhost:${port} on ${config.NODE_ENV}`
      );
    });
  }
}
