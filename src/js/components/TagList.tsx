import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

interface Tags {
  tags: Array<{ id: string; name: string }>;
}

const tagQuery = gql`
  {
    tags {
      id
      name
    }
  }
`;

interface Props {
  onChangeSelection?: (ids: string[]) => void;
  selectedTags?: string[];
}

const TagList: React.FC<Props> = ({
  onChangeSelection = () => void 0,
  selectedTags = []
}) => (
  <Query<Tags> query={tagQuery}>
    {({ data, error }) => {
      if (error) {
        return <div>{error.message}</div>;
      }

      if (data && data.tags) {
        return (
          <React.Fragment>
            {data.tags.map(t => (
              <label key={t.id}>
                <input
                  type="checkbox"
                  value={t.id}
                  onChange={() =>
                    onChangeSelection(
                      selectedTags.includes(t.id)
                        ? selectedTags.filter(st => st !== t.id)
                        : selectedTags.concat(t.id)
                    )
                  }
                />
                {t.name}
              </label>
            ))}
          </React.Fragment>
        );
      }

      return null;
    }}
  </Query>
);

export default TagList;
