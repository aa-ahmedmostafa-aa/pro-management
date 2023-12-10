import { UsersRequestDto } from "../models/users-request.dto";
import { IRelationProperties } from "../../../shared/models/relation";

export class UsersFiltrationService {
  public buildUsersFilterQuery = (usersRequest: UsersRequestDto) => {
    let searchQuery = {};

    if (usersRequest.email) {
      searchQuery = { ...searchQuery, email: usersRequest.email };
    }

    if (usersRequest.country) {
      searchQuery = { ...searchQuery, country: usersRequest.country };
    }

    return searchQuery;
  };

  public buildUsersComplexFilters = (
    usersRequest: UsersRequestDto
  ): string[] => {
    const result: string[] = [];

    if (usersRequest.userName) {
      result.push(`user.userName like LOWER('%${usersRequest.userName}%')`);
    }

    if (usersRequest.groups?.length) {
      result.push(`group.id in (${usersRequest.groups})`);
    }

    return result;
  };

  public getUsersRelationsProperties = (): IRelationProperties[] => {
    const usersRelations: IRelationProperties[] = [
      {
        navigationPropertyName: "user.group",
        selector: "group",
      },
    ];

    return usersRelations;
  };
}
