import { Field, ObjectType, Int } from 'type-graphql';

@ObjectType()
export class MealPlanSummary {
  @Field(_ => Int)
  totalCostInCents: number;

  @Field(_ => Int)
  perWeekSpendInCents: number;
}

@ObjectType()
export class MealPlan {
  constructor(
    public meals: Array<[number, number]>,
    public perWeekSpend: number
  ) {
    this.summary = new MealPlanSummary();
    this.summary.totalCostInCents = meals.reduce((acc, cur) => acc + cur[1], 0);
    this.summary.perWeekSpendInCents = perWeekSpend;
  }

  @Field()
  summary: MealPlanSummary;
}
