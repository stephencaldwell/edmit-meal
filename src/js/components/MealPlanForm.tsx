import React, { useState } from 'react';
import TagList from './TagList';
import MealPlanResult from './MealPlanResult';

interface State {
  netPay?: number;
  payFrequency: 'weekly' | 'semiweekly';
  restrictions: string[];
}

const MealPlanForm: React.FC = () => {
  const [state, updateState] = useState<State>({
    payFrequency: 'weekly',
    restrictions: []
  });

  return (
    <React.Fragment>
      <div>
        <label>
          Net Pay: $
          <input
            type="number"
            onChange={e => {
              const value = e.target.valueAsNumber;
              updateState(prevState => ({
                ...prevState,
                netPay: value
              }));
            }}
          />
        </label>
      </div>
      <div>
        Pay Frequency:{' '}
        <label>
          <input
            type="radio"
            name="frequency"
            value="weekly"
            checked={state.payFrequency === 'weekly'}
            onChange={e =>
              updateState(prevState => ({
                ...prevState,
                payFrequency: 'weekly'
              }))
            }
          />
          Weekly
        </label>
        <label>
          <input
            type="radio"
            name="frequency"
            value="semiWeekly"
            checked={state.payFrequency === 'semiweekly'}
            onChange={e =>
              updateState(prevState => ({
                ...prevState,
                payFrequency: 'semiweekly'
              }))
            }
          />
          Semi Weekly
        </label>
      </div>
      <div>
        Restrictions:{' '}
        <TagList
          selectedTags={state.restrictions}
          onChangeSelection={tags =>
            updateState(prevState => ({ ...prevState, restrictions: tags }))
          }
        />
      </div>
      {!!state.netPay ? (
        <MealPlanResult
          netPayPerWeek={
            (state.payFrequency === 'semiweekly'
              ? state.netPay / 2
              : state.netPay) || 0
          }
          restrictionIds={state.restrictions}
        />
      ) : (
        'Please enter your Net Pay.'
      )}
    </React.Fragment>
  );
};

export default MealPlanForm;
