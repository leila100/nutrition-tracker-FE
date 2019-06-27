import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import ApolloClient from "apollo-boost";
import { GET_CURRENT_USERID } from "../../graphql/queries";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import { withStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = theme => ({
  root: {
    flexGrow: 1,
    background: "#5E366A"
  },
  title: {
    // flexGrow: 1,
    fontSize: 16,
    background: "#5E366A",
    padding: 10,
    color: "#ffffff",
  },
  calTitle: {
    fontFamily: "Oswald"
  },
  card: {
    width: "100%",
    maxWidth: 960,
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    marginTop: 30,
    marginBottom: 50
  },
  num: {
    fontSize: 20
  },
  calCon: {
    display: "flex",
    textAlign: "center",
    justifyContent: "center"
  },
  progress: {
    margin: theme.spacing(2)
  }
});

class Calories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      calGoal: 2000
    };
  }

  componentDidMount() {
    const idToken = localStorage.getItem("token");
    this.getCurrentUser(idToken);
  }

  getCurrentUser = idToken => {
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
        // console.log(this.state.currentUser)
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes } = this.props;
    const CAL_QUERY = gql`
    query {
      getFoodEntriesByUserId(userId: ${this.state.currentUser}) {
        date
        servingQty
        food_id {
          caloriesPerServ
        }
      }
    }
    `;
    const CURRENT_USERID = gql`
      query getCurrentUser {
        getCurrentUser {
          id
        }
      }
    `;

    return (
      <div>
        <Query query={CURRENT_USERID}>
          {({ loading, error, data }) => {
            return (
              <Query query={CAL_QUERY}>
                {({ loading, error, data }) => {
                  if (loading)
                    return (
                      <Card className={classes.card}>
                        <CircularProgress className={classes.progress} />
                      </Card>
                    );
                  if (error) return <div>Error</div>;
                  const dateToday = new Date();
                  const month = dateToday.getMonth();
                  const day = dateToday.getDate();
                  const year = dateToday.getFullYear();
                  let foodEntries = data.getFoodEntriesByUserId;
                  foodEntries = foodEntries.filter(entry => {
                    const dateEntry = new Date(entry.date);
                    const entryMonth = dateEntry.getMonth();
                    const entryDay = dateEntry.getDate();
                    const entryYear = dateEntry.getFullYear();
                    return (
                      entryMonth === month &&
                      entryDay === day &&
                      entryYear === year
                    );
                  });

                  const calGoal = this.state.calGoal;
                  let mealCal = [];
                  // console.log("foodEntries:", foodEntries);
                  if (foodEntries.length === 0) {
                    const mealCal = 0;
                    const remainCal = calGoal - mealCal;
                    return (
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography className={classes.title}>
                            Today's Calories:
                          </Typography>
                        </CardContent>
                        <Container className={classes.calCon}>
                          <CardContent>
                            <Typography className={classes.calTitle} variant="h4">
                              Current Calories
                            </Typography>
                            <hr />
                            <Typography className={classes.num}>
                              {mealCal}
                            </Typography>
                          </CardContent>

                          <CardContent>
                            <Typography className={classes.calTitle} variant="h4">
                              Remaining Calories
                            </Typography>
                            <hr />
                            <Typography className={classes.num}>
                              {remainCal}
                            </Typography>
                          </CardContent>

                          <CardContent>
                            <Typography className={classes.calTitle} variant="h4">
                              Daily Calorie Goal
                            </Typography>
                            <hr />
                            <Typography className={classes.num}>
                              {calGoal}
                            </Typography>
                          </CardContent>
                        </Container>
                      </Card>
                    );
                  } else {
                    foodEntries.map(entry =>
                      mealCal.push(
                        entry.food_id.caloriesPerServ * entry.servingQty
                      )
                    );
                    mealCal = mealCal.reduce((a, b) => {
                      return a + b;
                    });
                    const remainCal = calGoal - mealCal;
                    return (
                      <Card className={classes.card}>
                        <CardContent>
                          <Typography className={classes.title}>
                            Today's Summary:
                          </Typography>
                        </CardContent>
                        <Container className={classes.calCon}>
                          <CardContent>
                            <Typography variant="h4">
                              Current Calories
                            </Typography>
                            <Typography className={classes.num}>
                              {mealCal}
                            </Typography>
                          </CardContent>

                          <CardContent>
                            <Typography variant="h4">
                              Remaining Calories
                            </Typography>
                            <Typography className={classes.num}>
                              {remainCal}
                            </Typography>
                          </CardContent>

                          <CardContent>
                            <Typography variant="h4">
                              Daily Calorie Goal
                            </Typography>
                            <Typography className={classes.num}>
                              {calGoal}
                            </Typography>
                          </CardContent>
                        </Container>
                      </Card>
                    );
                  }
                }}
              </Query>
            );
          }}
        </Query>
      </div>
    );
  }
}

export default withStyles(styles)(Calories);