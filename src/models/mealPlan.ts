import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class MealPlanSummary {
  @Field(_ => Int)
  totalCostInCents: number;
}

@ObjectType()
export class MealPlan {
  constructor(public meals: Array<[number, number]>) {
    this.summary = new MealPlanSummary();
    this.summary.totalCostInCents = meals.reduce((acc, cur) => acc + cur[1], 0);
  }

  @Field()
  summary: MealPlanSummary;
}
