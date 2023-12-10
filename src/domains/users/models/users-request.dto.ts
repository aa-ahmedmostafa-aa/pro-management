import { IPaginatedRequest } from "./../../../shared/models/paginated-request";
export interface UsersRequestDto extends IPaginatedRequest {
  userName?: string;
  email?: string;
  country?: string;
  groups?: number[];
}
