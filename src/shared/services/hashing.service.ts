import bcrypt from "bcryptjs";
import config from "../../../config";

export class HashingService {
    private saltRounds!: number;

    constructor() {
        this.saltRounds = config.SALT_ROUNDS;
    }

    public async hash(data: string): Promise<string> {
        return await bcrypt.hash(data, this.saltRounds);
    }

    public async verify(data: string, hashValue: string): Promise<boolean> {
        return await bcrypt.compare(data, hashValue);
    }
}