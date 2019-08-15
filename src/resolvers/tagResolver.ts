import { Resolver, Query } from 'type-graphql';
import { Tag } from '../models/tag';
import { getRepository } from 'typeorm';

@Resolver()
export class TagResolver {
  @Query(_ => [Tag])
  public tags() {
    return getRepository(Tag).find();
  }
}
