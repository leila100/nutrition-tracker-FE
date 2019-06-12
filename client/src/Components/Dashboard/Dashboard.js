import React, { Component } from "react";
import Calories from "./Calories";
import EntryForm from "./EntryForm";
import ModifiedEntryForm from "./ModifiedEntryForm";
import FoodEntry from "./FoodEntry";
import Exercise from "./Exercise";
import ExerciseEntry from "./ExerEntry";
import styled from "styled-components";
import ApolloClient from "apollo-boost";
import moment from "moment";
import gql from "graphql-tag";
import { ADD_EXERENTRY, ADD_FOOD_ENTRY } from "../../graphql/mutations";
import { EXER_QUERY, GET_CURRENT_USERID } from "../../graphql/queries";

<<<<<<< HEAD
=======
const GET_FOOD_ENTRIES_BY_USER_QUERY = gql`
  query($userId: ID!) {
    getFoodEntriesByUserId(userId: $userId) {
      id
      date
      servingQty
      user_id {
        username
        firstName
        lastName
        email
        id
      }
      food_id {
        foodName
        caloriesPerServ
        fats
        proteins
        carbs
      }
      meal_category_id {
        mealCategoryName
      }
    }
  }
`;

>>>>>>> development
class Dashboard extends Component {
  state = {
    showFoodForm: true,
    showExerForm: true,
    currentUser: 0,
    exerEntries: [],
    foodEntries: []
  };

  componentDidMount = () => {
    const idToken = localStorage.getItem("token");
    const client = new ApolloClient({
      uri: "https://nutrition-tracker-be.herokuapp.com",
      headers: { authorization: idToken }
    });
    client
      .query({
        query: GET_CURRENT_USERID
      })
      .then(response => {
        this.setState({ currentUser: response.data.getCurrentUser.id });
        client
          .query({
            query: EXER_QUERY,
            variables: {
              userId: this.state.currentUser
            }
          })
          .then(response => {
            this.setState({
              exerEntries: response.data.getExerciseEntriesByUserId
            });
            client
              .query({
                query: GET_FOOD_ENTRIES_BY_USER_QUERY,
                variables: {
                  userId: this.state.currentUser
                }
              })
              .then(response => {
                console.log(this.state.currentUser);
                console.log("food response", response);
                this.setState({
                  foodEntries: response.data.getFoodEntriesByUserId
                });
              });
          });
      })
      // .then(
      // client
      //   .query({
      //     query: GET_FOOD_ENTRIES_BY_USER_QUERY,
      //     variables: {
      //       userId: this.state.currentUser
      //     }
      //   })
      //   .then(response => {
      //     console.log(this.state.currentUser)
      //     console.log('food response', response)
      //     this.setState({
      //       foodEntries: response.data.getFoodEntriesByUserId
      //     })

      //   })
      // )
      .catch(err => console.log(err));
  };

  addFoodEntry = newFoodEntry => {
    const client = new ApolloClient({
      uri: "https://nutrition-tracker-be.herokuapp.com"
    });

    client
      .mutate({
        mutation: ADD_FOOD_ENTRY,
        variables: {
          input: newFoodEntry
        }
      })
      .then(response => {
        client
          .query({
            query: GET_FOOD_ENTRIES_BY_USER_QUERY,
            variables: {
              userId: this.state.currentUser
            }
          })
          .then(response => {
            this.setState({ foodEntries: response.data.getFoodEntriesByUserId });
          });
      })
      .catch(err => console.log(err));
  };

  addExerEntry = newExerEntry => {
    const client = new ApolloClient({
      uri: "https://nutrition-tracker-be.herokuapp.com"
    });

    client
      .mutate({
        mutation: ADD_EXERENTRY,
        variables: {
          input: newExerEntry
        }
      })
      .then(response => {
        client
          .query({
            query: EXER_QUERY,
            variables: {
              userId: this.state.currentUser
            }
          })
          .then(response => {
            this.setState({
              exerEntries: response.data.getExerciseEntriesByUserId
            });
          });
      })
      .catch(err => console.log(err));
  };

  // addExerEntry = (newExerEntry) => {
  //   const client = new ApolloClient({
  //     uri: "https://nutrition-tracker-be.herokuapp.com"
  //   });

  //   client
  //     .mutate({
  //       mutation: ADD_EXERENTRY,
  //       variables: {
  //         input: newExerEntry
  //       }
  //     })
  //     .then((response) => {
  //       console.log(response);
  //     })
  //     .catch(err => console.log(err));
  // };
  // maybe add ?
  // {this.props.selectedFood && !this.state.showFoodForm &&
  // <EntryForm
  //   selectedFood={this.props.selectedFood}
  // />
  // }
  // {!this.props.selectedFood && this.state.showFoodForm &&
  // <EntryForm closeFoodForm={this.closeFoodForm} />}
  // {this.state.showExerForm && <Exercise
  //   addExerEntry={this.addExerEntry}
  //   closeExerEntry={this.closeExerEntry} />}

  handleShowFood = () => {
    this.setState({
      showFoodForm: true
    });
  };

  closeFoodForm = () => {
    this.setState({
      showFoodForm: false
    });
  };

  openExerEntry = () => {
    this.setState({
      showExerForm: true
    });
  };

  closeExerEntry = () => {
    this.setState({
      showExerForm: false
    });
  };
  render() {
    const currentDate = moment(new Date()).format("MMMM Do YYYY");
    console.log(this.props.selectedFood ? this.props.selectedFood.label : this.props.selectedFood);
    return (
      <DashContainer>
        <DashTitle>{currentDate}</DashTitle>
        <Calories />
        {!this.state.showFoodForm && <button onClick={this.handleShowFood}> Add Food</button>}
        {!this.state.showExerForm && <button onClick={this.openExerEntry}> Add Exercise</button>}
        <DashDisplay className='container'>
          <InfoCon>
            <FoodEntry foodEntries={this.state.foodEntries} />
            <ExerciseEntry exerEntries={this.state.exerEntries} />
          </InfoCon>
          {this.state.showFoodForm && (
            <EntryForm addFoodEntry={this.addFoodEntry} selectedFood={this.props.selectedFood} />
          )}
          {this.state.showExerForm && (
            <Exercise closeExerEntry={this.closeExerEntry} addExerEntry={this.addExerEntry} />
          )}
        </DashDisplay>
      </DashContainer>
    );
  }
}

const DashContainer = styled.div`
  width: 100%;
`;

const DashTitle = styled.div`
  font-size: 3rem;
  text-align: center;
`;

const InfoCon = styled.div`
  display: flex;
  width: 40%;
`;

const DashDisplay = styled.div`
  width: 100%;
  display: flex;
  justifty-content: space-around;
`;

export default Dashboard;
