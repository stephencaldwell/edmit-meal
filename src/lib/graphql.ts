import { buildSchema } from 'type-graphql';
import { MealPlanResolver } from '../resolvers/mealPlanResolver';
import graphqlHTTP from 'express-graphql';
import { TagResolver } from '../resolvers/tagResolver';
import { RecipeResolver } from '../resolvers/recipeResolver';

export function initGraphql() {
  return buildSchema({
    resolvers: [MealPlanResolver, TagResolver, RecipeResolver],
    validate: false
  }).then(schema => graphqlHTTP({ schema, graphiql: true }));
}
