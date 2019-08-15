import { Resolver, Arg, Query, ID } from 'type-graphql';
import { getRepository } from 'typeorm';
import { Recipe } from '../models/recipe';

@Resolver()
export class RecipeResolver {
  @Query(_ => Recipe)
  recipe(@Arg('recipeId', _ => ID) recipeId: string) {
    return getRepository(Recipe).findOne(recipeId);
  }
}
