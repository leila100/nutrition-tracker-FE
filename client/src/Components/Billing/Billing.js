import React from "react";
import { Mutation } from "react-apollo";
import StripeCheckout from 'react-stripe-checkout';
import BillingHistory from './BillingHistory';
import ApolloClient from "apollo-boost";
import moment from 'moment';
import styled from "styled-components";
import AccountNav from '../AccountNav';
import { makeStyles } from '@material-ui/core/styles';
import { wrap } from "module";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

import {GET_CURRENT_USER_QUERY, GET_RECENT_BILLING} from "../../graphql/queries";
import {CREATE_SUBSCRIPTION} from "../../graphql/mutations";

const BillingContainer = styled.div`
  margin-top:30px;
  padding-top:50px;
  display:flex;
  flex-direction:row;
  justify-content:center;
  flex-wrap:wrap;
  width:60%;
  background-color: white;
  height:500px;
  -webkit-box-shadow: 6px 6px 15px -5px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 6px 15px -5px rgba(0,0,0,0.75);
  box-shadow: 6px 6px 15px -5px rgba(0,0,0,0.75);
`;

const BillingTop = styled.div`
  display: flex;
  flex-direction: column;
  align-items:center;
  height:100px;
  width: 100%;
`;

const divStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  alignItems: "flex-start"
  // marginLeft: "25%"
}

// const useStyles = makeStyles(theme => ({

//   root: {
//     display: 'flex',
//   }

// }));
// const classes = useStyles();

 class Billing extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      subscriptionLapse: "",
      premiumCurrent: false,
      userType: "",
      name: "",
      email: ""
    }
  }

  componentDidMount(){
    this.getCurrentUser(localStorage.getItem("token"))
  }
  getCurrentUser = async idToken => {
    const client = new ApolloClient({
      uri: "https://nutrition-tracker-be.herokuapp.com",
      headers: { authorization: idToken }
    });

    await client
      .query({
        query: GET_CURRENT_USER_QUERY
      })
      .then(response => {
        this.getRecentBilling(response.data.getCurrentUser.id)
        this.setState({
          userType: response.data.getCurrentUser.userType,
          name: response.data.getCurrentUser.firstName,
          email: response.data.getCurrentUser.email
        })
      })
      .catch(err => console.log(err));
  };

  getRecentBilling = async id => {
    const client = new ApolloClient({
      uri: "https://nutrition-tracker-be.herokuapp.com"
    });

    await client
      .query({
        query: GET_RECENT_BILLING,
        variables: {
          id: id
        }
      })
      .then(response => {
        this.getDates(response.data.getRecentBilling.date)
      })
      .catch(err => console.log(err))
  }

  getDates = date => {
    const lastCycle = moment(date).format();
    const today = moment();
    const thirtyDays = moment(lastCycle).add(30, 'days').format('ddd MMMM D YYYY')

    if(today.diff(lastCycle, 'days') < 30){
      this.setState({
        subscriptionLapse: thirtyDays,
        premiumCurrent: !this.state.premiumCurrent
      })
    }else{
      this.setState({
        premiumCurrent: !this.state.premiumCurrent
      })
    }
  };

  render(){
    const premium = 700;
    const coach = 1000;
    const { classes } = this.props;
    return(

      // <div
      // className={classes.root}
      // >

      <div style={divStyle}>
            <AccountNav />
    <Grid 
      item md={8} xs={12}
      container
      justify="center"
      alignItems="center"
      border="1px solid black"
      classes={{ root: classes.gridContainer }}
    >
        <BillingContainer>
          <BillingTop>
          <p style={{fontSize:"2rem"}}>Type:{this.state.userType.toUpperCase()}</p>
          <p style={{fontSize:"2rem"}}>{
            this.state.subscriptionLapse.length > 1 ? (
              <p>Subscription Until: {this.state.subscriptionLapse}</p>
            ) : (null)
          }</p>
          <Mutation mutation={CREATE_SUBSCRIPTION} onError={err => {console.log(err)}}>
            {mutation => (
              <div>
                <StripeCheckout
                  amount={premium}
                  label="Become a Premium User"
                  description="Become a Premium User!"
                  locale="auto"
                  name="NutritionTrkr"
                  email={this.state.email}
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  token={async token => {
                    console.log(token.id,token.email, premium)
                    const response = await mutation({
                      variables: {
                        source: token.id,
                        email: token.email,
                        amount: premium
                      }
                    });
                    console.log(response)
                  }}
                  zipcode
                />
                <StripeCheckout
                  amount={coach}
                  label="Become a Coach"
                  description="Become a Coach!"
                  locale="auto"
                  name="NutritionTrkr"
                  email={this.state.email}
                  stripeKey={process.env.REACT_APP_STRIPE_KEY}
                  token={async token => {
                    console.log(token)
                    const response = await mutation({
                      variables: {
                        source: token.id,
                        email: token.email,
                        amount: coach
                      }
                    });
                    console.log(response)
                  }}
                  zipcode
                />
              </div>
            )}
          </Mutation>
        </BillingTop>
          <BillingHistory/>
        </BillingContainer>
        </Grid>
      </div>
   
    )
  }
}

const styles = theme => ({
  gridContainer: {
    padding: "3%",
    // margin: "20% 0",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",

  }
});

 export default withStyles(styles)(Billing);
