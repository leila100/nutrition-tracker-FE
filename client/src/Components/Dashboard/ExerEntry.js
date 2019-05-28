import React from "react";
import styled from "styled-components";
import { Query } from "react-apollo";
import gql from "graphql-tag";

const ExerciseActivity = styled.div`
  padding: 10px;
`;

class FoodEntry extends React.Component {
  state = {
    currentUser: 2
  };

  render() {
    const EXER_QUERY = gql`
      query {
        getExerciseEntriesByUserId(userId: ${this.state.currentUser}) {
          exerciseEntryDate
          exerciseName
          caloriesBurned
        }
      }
    `;

    return (
      <div>
        <div>
          <div>Today's Exercise:</div>
          <Query query={EXER_QUERY}>
            {({ loading, error, data }) => {
              if (loading) return <div>Fetching Entries</div>;

              if (error) return <div>Error</div>;

              const dateToday = new Date();
              const month = dateToday.getMonth();
              const day = dateToday.getDate();
              const year = dateToday.getFullYear();
              console.log(data);
              let exerEntries = data.getExerciseEntriesByUserId;

              exerEntries = exerEntries.filter(entry => {
                const dateEntry = new Date(entry.exerciseEntryDate);
                const entryMonth = dateEntry.getMonth();
                const entryDay = dateEntry.getDate();
                const entryYear = dateEntry.getFullYear();
                return (
                  entryMonth === month && entryDay === day && entryYear === year
                );
              });

              console.log(exerEntries);

              if (exerEntries.length === 0) {
                return <div>No exercise entered today.</div>;
              } else {
                return (
                  <div>
                    {exerEntries.map(entry => (
                      <ExerciseActivity>
                        <div>Activity: {entry.exerciseName}</div>
                        <div>Calories burned: {entry.caloriesBurned}</div>
                      </ExerciseActivity>
                    ))}
                  </div>
                );
              }
            }}
          </Query>
        </div>
      </div>
    );
  }
}

export default FoodEntry;
