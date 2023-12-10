import { StatusCodes } from '../enums/status-codes';
import { logger } from '../services/logger.service';
import { IResponseBase } from './response-base';

export class ErrorResponse implements IResponseBase {
    message: string;
    statusCode: StatusCodes;
    additionalInfo?: any;

    constructor(message: string, statusCode: StatusCodes, additionalInfo: any = {}) {
        this.message = message;
        this.statusCode = statusCode;
        this.additionalInfo = additionalInfo;

        logger.error(message);
        logger.error(JSON.stringify(additionalInfo));
        logger.error(`Status Code: ${statusCode}`)
    }
}