import {
  Resolver,
  Arg,
  ID,
  Query,
  FieldResolver,
  Root,
  Int
} from 'type-graphql';
import { Recipe } from '../models/recipe';
import { getRepository } from 'typeorm';
import { RecipeIngredient } from '../models/recipeIngredient';
import { MealPlan } from '../models/mealPlan';

@Resolver(_ => MealPlan)
export class MealPlanResolver {
  @Query(_ => MealPlan, { nullable: true })
  public async mealPlan(
    @Arg('restrictionTags', _ => [ID]) restrictionTags: string[],
    @Arg('netPayInCents', _ => Int) netPayInCents: number
  ) {
    // This logic would not normally be in the resolver, but for simplicities sake, I put it here.

    const restrictedRecipes = getRepository(RecipeIngredient)
      .createQueryBuilder('rri')
      .innerJoin('rri.ingredient', 'ring')
      .innerJoin('ring.tags', 'rt')
      .where('rt.id IN (:...restrictionTags)')
      .select('rri.recipeId');

    const recipeCostsQuery = getRepository(Recipe)
      .createQueryBuilder('r')
      .select('r.id')
      .addSelect('SUM(i.unitPriceInCents * ri.quantity)', 'recipeCost')
      .innerJoin(RecipeIngredient, 'ri', 'ri.recipeId = r.id')
      .innerJoin('ri.ingredient', 'i', 'i.id = ri.ingredientId')
      .groupBy('r.id');

    if (restrictionTags.length > 0) {
      recipeCostsQuery.where(`r.id NOT IN (${restrictedRecipes.getQuery()})`);
    }

    const recipeCosts = (await recipeCostsQuery
      .setParameters({ restrictionTags })
      .getRawMany()) as Array<{ r_id: number; recipeCost: number }>;

    // We'll use 10% as the food budget number, based on reporting from the USDA Economic Research Service
    // We'll assume 3 meals a day, 7 days a week
    const perDaySpend = (netPayInCents * 0.1) / 7;
    const perMealSpend = perDaySpend / 3;
    const eligibleMeals = recipeCosts.filter(r => r.recipeCost <= perMealSpend);

    if (eligibleMeals.length === 0) {
      return null;
    }

    const meals = [];
    for (let i = 0; i < 21; i++) {
      const mealIdx = Math.floor(Math.random() * eligibleMeals.length);
      meals[i] = eligibleMeals[mealIdx % eligibleMeals.length];
    }

    const costLookup = new Map(recipeCosts.map(c => [c.r_id, c.recipeCost]));
    const result = new MealPlan(
      meals.map(m => [m.r_id, costLookup.get(m.r_id) || 0])
    );
    return result;
  }

  @FieldResolver(_ => [Recipe])
  public day1Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 0);
  }

  @FieldResolver(_ => [Recipe])
  public day2Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 3);
  }

  @FieldResolver(_ => [Recipe])
  public day3Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 6);
  }

  @FieldResolver(_ => [Recipe])
  public day4Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 9);
  }

  @FieldResolver(_ => [Recipe])
  public day5Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 12);
  }

  @FieldResolver(_ => [Recipe])
  public day6Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 15);
  }

  @FieldResolver(_ => [Recipe])
  public day7Meals(@Root() mealPlan: MealPlan) {
    return this.dayMeals(mealPlan, 18);
  }

  private dayMeals(mealPlan: MealPlan, idx: number) {
    const ids = mealPlan.meals.slice(idx, idx + 3).map(m => m[0]);
    return getRepository(Recipe)
      .findByIds(ids)
      .then(recipes =>
        recipes
          .map(r => ids.filter(i => i == r.id).map(() => r))
          .reduce((acc, cur) => acc.concat(cur), [])
      );
  }
}
