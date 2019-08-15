import React, { useState } from 'react';
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
    };
  };
}

interface MealPlanQueryVariables {
  netPayInCents: number;
  restrictionTags: string[];
}

const mealPlanQuery = gql`
  query MealPlanQuery($netPayInCents: Int!, $restrictionTags: [ID!]!) {
    mealPlan(netPayInCents: $netPayInCents, restrictionTags: $restrictionTags) {
      day1Meals {
        id
        name
      }
      day2Meals {
        id
        name
      }
      day3Meals {
        id
        name
      }
      day4Meals {
        id
        name
      }
      day5Meals {
        id
        name
      }
      day6Meals {
        id
        name
      }
      day7Meals {
        id
        name
      }
      summary {
        totalCostInCents
      }
    }
  }
`;

const MealPlanResult: React.FC<Props> = ({ netPayPerWeek, restrictionIds }) => {
  const [visibleRecipe, setVisibleRecipe] = useState<string>();

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
              Total Cost: ${data.mealPlan.summary.totalCostInCents / 100}
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
                                setVisibleRecipe(`${k}_${r.id}`);
                              }}
                            >
                              <div>{r.name}</div>
                            </a>
                            {visibleRecipe === `${k}_${r.id}` ? (
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
