import { HashingService } from "./../../../shared/services/hashing.service";
import { GenericRepository } from "./../../../shared/repository/implementations/generic-repository";
import { IGenericRepository } from "../../../shared/repository/abstractions/generic-repository";
import { ResetPasswordsRequest } from "../entities/reset-password-requests.entity";
import randomstring from "randomstring";
import { randomBytes } from "crypto";

export class PasswordResettingService {
  private readonly resetRequestsRepository: IGenericRepository<ResetPasswordsRequest>;
  private readonly hashingService: HashingService;

  constructor() {
    this.resetRequestsRepository = new GenericRepository(ResetPasswordsRequest);
    this.hashingService = new HashingService();
  }

  async findResetRequestById(id: number) {
    return this.resetRequestsRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findResetRequestForUser(userId: number) {
    return this.resetRequestsRepository.findOne({
      where: {
        userId,
      },
    });
  }

  async findResetPasswordBySeed(seed: string) {
    return this.resetRequestsRepository.findOne({
      where: {
        seed: seed,
      },
    });
  }

  async addResetRequest(
    userId: number
  ): Promise<{ seed: string; requestId?: number }> {
    const newPasswordResetRequest = new ResetPasswordsRequest();
    newPasswordResetRequest.userId = userId;

    newPasswordResetRequest.seed = randomBytes(2).toString("hex");

    const result = await this.resetRequestsRepository.create(
      newPasswordResetRequest
    );

    return result;
  }

  async removeResetRequest(resetPasswordRequestId: number) {
    return this.resetRequestsRepository.delete(resetPasswordRequestId);
  }

}
