import { ObjectType } from 'typeorm';
import { GenericLookupsService } from '../../../shared/services/generic-lookups.service';

export class UsersLookupsValidationService {
    static async validateLookup<T>(type: ObjectType<T>, lookupId: number) {
        const lookupService = new GenericLookupsService(type);
        return lookupService.getOne(lookupId);
    }
}