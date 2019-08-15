import {
  Resolver,
  Arg,
  Query,
  ID,
  FieldResolver,
  Root,
  Int
} from 'type-graphql';
import { getRepository } from 'typeorm';
import { Recipe } from '../models/recipe';
import { RecipeIngredient } from '../models/recipeIngredient';
import { Ingredient } from '../models/ingredient';

@Resolver(_ => Recipe)
export class RecipeResolver {
  @Query(_ => Recipe)
  recipe(@Arg('recipeId', _ => ID) recipeId: string) {
    return getRepository(Recipe).findOne(recipeId);
  }

  @FieldResolver(_ => Int)
  costInCents(@Root() recipe: Recipe) {
    return getRepository(RecipeIngredient)
      .createQueryBuilder('ri')
      .innerJoin('ri.ingredient', 'i')
      .select('SUM(ri.quantity * i.unitPriceInCents)', 'cost')
      .where('ri.recipeId = :recipeId', { recipeId: recipe.id })
      .getRawOne()
      .then(result => result.cost);
  }
}
