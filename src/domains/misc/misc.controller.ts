import { MessageResponse } from './../../shared/models/message-response';
import { StatusCodes } from './../../shared/enums/status-codes';
import { ResponseHandlingService } from './../../shared/services/response-handling.service';
import config from "../../../config";
import { Response } from 'express';

export class MiscController {
    public ping(res: Response) {
        return new ResponseHandlingService(
            res, 
            `PONG !! from ${config.SERVICE_NAME} - ${new Date()}`,
            StatusCodes.OK);
    }
}