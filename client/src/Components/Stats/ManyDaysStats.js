import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Bar } from "react-chartjs-2";
import * as moment from "moment";
import Grid from "@material-ui/core/Grid";
import { defaults } from "react-chartjs-2";

import { getTotalData } from "../../util/getTotalData";
import { makeRandomColor } from "../../util/makeRandomColor";

class ManyDaysStats extends Component {
  state = {
    entries: [],
    labels: this.props.days
  };

  componentDidMount = () => {
    this.updateEntries();
  };

  componentDidUpdate = prevProps => {
    if (
      prevProps.foodEntries !== this.props.foodEntries ||
      prevProps.days !== this.props.days ||
      prevProps.data !== this.props.data
    )
      this.updateEntries();
  };

  updateEntries = () => {
    const { foodEntries } = this.props;
    const data = getTotalData(foodEntries, this.props.data, this.props.days);
    this.setState({ entries: data });
  };

  render() {
    defaults.global.defaultFontColor = "#2196F3";
    const { classes } = this.props;
    const labels = this.props.days.map(day => moment(day).format("MMM Do YYYY"));
    const data = {
      labels: labels,
      datasets: [
        {
          label: this.props.data === "caloriesPerServ" ? "Calories" : this.props.data,
          backgroundColor: "#2196F3",
          borderColor: "#F4B4C3",
          borderWidth: 1,
          hoverBackgroundColor: "#2196F3",
          hoverBorderColor: makeRandomColor(),
          data: this.state.entries
        }
      ]
    };

    return (
      <div className={classes.root}>
        <h2 className={classes.header}>
          Total {this.props.data === "caloriesPerServ" ? "Calories" : this.props.data} for the last
          {this.props.days.length} days
        </h2>
        {this.state.entries.length !== 0 ? (
          <Grid container justify='center' alignItems='center'>
            <Grid item xs={4}>
              {this.state.entries.map((entry, i) => (
                <div key={labels[i]} className={classes.dataInfo}>
                  <span className={classes.title}>{labels[i]}</span>
                  <div className={classes.value}>{entry === 0 ? "No Entry" : entry.toFixed(2)}</div>
                </div>
              ))}
            </Grid>
            <Grid item xs={8} className={classes.graph}>
              <Bar
                data={data}
                // width={100}
                height={350}
                options={{
                  maintainAspectRatio: false
                }}
              />
            </Grid>
          </Grid>
        ) : (
          <div> No data </div>
        )}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: "100%",
    margin: "50px auto",
    maxWidth: "1200px",
    padding: "20px"
  },
  graph: {
    border: "3px solid #F4B4C3",
    padding: "20px"
  },
  header: {
    textAlign: "center",
    fontSize: "3.5rem",
    marginBottom: "20px",
    color: "#2196F3",
    textTransform: "uppercase"
  },
  title: {
    color: "#2196F3",
    fontSize: "2rem",
    width: "40%"
  },
  value: {
    margin: "10px 0",
    fontSize: "1.8rem",
    paddingLeft: "10px"
  },
  dataInfo: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    height: "50px"
  }
});

export default withStyles(styles)(ManyDaysStats);
