import { ITokenClaim } from "./../models/token-claim";
import jwt, { SignOptions } from "jsonwebtoken";
import path from "path";
import config from "../../../config";
import fs from "fs";

export class JwtService {
  private readonly privateKeyPath!: string;
  private readonly expiry!: number;
  private readonly publicKeyPath!: string;
  private readonly secretKey!: string;

  constructor() {
    this.privateKeyPath = path.join(
      config.TOKEN_KEYS_PATH,
      config.TOKEN_PRIVATE_KEY_NAME
    );
    this.publicKeyPath = path.join(
      config.TOKEN_KEYS_PATH,
      config.TOKEN_PUBLIC_KEY_NAME
    );
    // this.secretKey = config.TOKEN_SECRET_KEY;
    this.expiry = 3600000;
  }

  sign(tokenClaims: ITokenClaim[]): string {
    const privateKey = fs.readFileSync(this.privateKeyPath);
    return jwt.sign(
      this.getClaimsObject(tokenClaims),
      privateKey,
      this.getSignOptions()
    );
  }

  verify(token: string): any {
    const publicKey = fs.readFileSync(this.publicKeyPath);
    return jwt.verify(token, publicKey);
  }

  verifySecretToken(token: string): any {
    return jwt.verify(token, this.secretKey);
  }

  private getClaimsObject(tokenClaims: ITokenClaim[]) {
    let claims: any = {};

    tokenClaims.forEach((claim) => {
      claim = { ...claims, [claim.key]: claim.value };
    });

    for (const claim of tokenClaims) {
      claims = { ...claims, [claim.key]: claim.value };
    }

    return claims;
  }

  private getSignOptions(): SignOptions {
    const signOptions: SignOptions = {
      algorithm: "RS256",
      expiresIn: this.expiry,
    };

    return signOptions;
  }
}
