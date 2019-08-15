import React, { useState } from 'react';
import { ApolloProvider, Query } from 'react-apollo';

import { initGraphql } from './lib/graphql';
import MealPlanForm from './components/MealPlanForm';

const App: React.FC = () => {
  return (
    <div>
      <ApolloProvider client={initGraphql()}>
        <MealPlanForm />
      </ApolloProvider>
    </div>
  );
};

export default App;
