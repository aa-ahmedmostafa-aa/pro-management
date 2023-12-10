import { IResponseBase } from "./response-base";

export class MessageResponse implements IResponseBase {
    message: string;

    constructor(message: string) {
        this.message = message;
    }
}