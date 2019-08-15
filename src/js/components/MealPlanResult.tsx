import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import moment from 'moment';
import RecipeDetail from './RecipeDetail';

interface Props {
  netPayPerWeek: number;
  restrictionIds: string[];
}

interface RecipeInfo {
  id: string;
  name: string;
  costInCents: number;
}

interface MealPlanQueryResult {
  mealPlan: {
    day1Meals: RecipeInfo[];
    day2Meals: RecipeInfo[];
    day3Meals: RecipeInfo[];
    day4Meals: RecipeInfo[];
    day5Meals: RecipeInfo[];
    day6Meals: RecipeInfo[];
    day7Meals: RecipeInfo[];
    summary: {
      totalCostInCents: number;
      perWeekSpendInCents: number;
    };
  };
}

interface MealPlanQueryVariables {
  netPayInCents: number;
  restrictionTags: string[];
}

const mealPlanQuery = gql`
  fragment DayMeals on Recipe {
    id
    name
    costInCents
  }

  query MealPlanQuery($netPayInCents: Int!, $restrictionTags: [ID!]!) {
    mealPlan(netPayInCents: $netPayInCents, restrictionTags: $restrictionTags) {
      day1Meals {
        ...DayMeals
      }
      day2Meals {
        ...DayMeals
      }
      day3Meals {
        ...DayMeals
      }
      day4Meals {
        ...DayMeals
      }
      day5Meals {
        ...DayMeals
      }
      day6Meals {
        ...DayMeals
      }
      day7Meals {
        ...DayMeals
      }
      summary {
        totalCostInCents
        perWeekSpendInCents
      }
    }
  }
`;

const MealPlanResult: React.FC<Props> = ({ netPayPerWeek, restrictionIds }) => {
  const [visibleRecipe, setVisibleRecipe] = useState<string | null>();

  useEffect(() => {
    setVisibleRecipe(null);
  }, [netPayPerWeek, restrictionIds]);

  return (
    <Query<MealPlanQueryResult, MealPlanQueryVariables>
      query={mealPlanQuery}
      fetchPolicy="network-only"
      variables={{
        netPayInCents: netPayPerWeek * 100,
        restrictionTags: restrictionIds
      }}
    >
      {({ data, error }) => {
        if (error) {
          return <div>{error.message}</div>;
        }

        if (data && data.mealPlan === null) {
          return <div>There aren't any meal plans that meet your needs.</div>;
        }

        if (data && data.mealPlan) {
          return (
            <React.Fragment>
              <div>
                Budget: $
                {(data.mealPlan.summary.perWeekSpendInCents / 100).toFixed(2)}
              </div>
              <div>
                Total Cost: $
                {(data.mealPlan.summary.totalCostInCents / 100).toFixed(2)}
              </div>
              {Object.keys(data.mealPlan).map((k, i) => {
                if (!((data.mealPlan as any)[k] instanceof Array)) {
                  return null;
                }

                return (
                  <div key={k}>
                    {moment.weekdays(i)}:
                    <ul>
                      {(data.mealPlan as any)[k].map(
                        (r: RecipeInfo, i: number) => (
                          <li key={`${i}_${r.id}`}>
                            <a
                              href="#"
                              onClick={e => {
                                e.preventDefault();
                                setVisibleRecipe(`${k}_${r.id}_${i}`);
                              }}
                            >
                              <div>
                                {r.name} - ${(r.costInCents / 100).toFixed(2)}
                              </div>
                            </a>
                            {visibleRecipe === `${k}_${r.id}_${i}` ? (
                              <React.Fragment>
                                Ingredients:
                                <RecipeDetail recipeId={r.id} />
                              </React.Fragment>
                            ) : null}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                );
              })}
            </React.Fragment>
          );
        }

        return null;
      }}
    </Query>
  );
};

export default MealPlanResult;
