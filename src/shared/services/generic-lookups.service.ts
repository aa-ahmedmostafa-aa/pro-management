import { GenericRepository } from './../repository/implementations/generic-repository';
import { IGenericRepository } from './../repository/abstractions/generic-repository';
import { ObjectType } from 'typeorm';

export class GenericLookupsService<T> {
    private readonly genericLookupRepository: IGenericRepository<T>;

    constructor(type: ObjectType<T>) {
        this.genericLookupRepository = new GenericRepository(type);
    }

    getAll() {
        return this.genericLookupRepository.findLookup({
            id: true,
            name: true
        })
    }

    getOne(lookupId: number) {
        return this.genericLookupRepository.findOne({
            where: {
                id: lookupId
            }
        })
     }

    create(lookup: T) {
        return this.genericLookupRepository.create(lookup);
     }

    update(lookup: T) {
        return this.genericLookupRepository.update(lookup);
     }

    delete(lookupId: number) {
        return this.genericLookupRepository.delete(lookupId);
     }
}