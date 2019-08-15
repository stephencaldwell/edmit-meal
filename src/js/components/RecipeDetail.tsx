import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface Props {
  recipeId: string;
}

interface RecipeDetailResult {
  recipe: {
    id: string;
    ingredients: Array<{
      id: string;
      quantity: number;
      ingredient: {
        id: string;
        name: string;
      };
    }>;
  };
}

interface RecipeDetailVariables {
  recipeId: string;
}

const recipeDetailQuery = gql`
  query GetRecipe($recipeId: ID!) {
    recipe(recipeId: $recipeId) {
      id
      ingredients {
        id
        quantity
        ingredient {
          id
          name
        }
      }
    }
  }
`;

const RecipeDetail: React.FC<Props> = ({ recipeId }) => (
  <Query<RecipeDetailResult, RecipeDetailVariables>
    query={recipeDetailQuery}
    variables={{ recipeId }}
  >
    {({ data, error }) => {
      if (error) {
        return <div>{error.message}</div>;
      }

      if (data && data.recipe) {
        return (
          <ul>
            {data.recipe.ingredients.map(i => (
              <li key={i.id}>
                {i.quantity} x {i.ingredient.name}
              </li>
            ))}
          </ul>
        );
      }

      return null;
    }}
  </Query>
);

export default RecipeDetail;
