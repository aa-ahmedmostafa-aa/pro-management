export class TokenResponse {
    token: string;
    expiresIn: string;

    constructor(token: string, expiresIn: number) {
        this.token = token;

        const currentDate = new Date();
        currentDate.setSeconds(expiresIn);
        
        this.expiresIn = currentDate.toString();
    }
}