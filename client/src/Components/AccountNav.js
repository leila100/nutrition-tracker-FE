import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import Subject from "@material-ui/icons/Subject";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Payment from "@material-ui/icons/Payment";

const drawerWidth = 250;

const useStyles = makeStyles(theme => ({
  root: {
    fontFamily: "Roboto",
    zIndex: 0,
    display: "flex",
    color: "white",
    alignItems: "center",
    position: "relative",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  title: {
    textDecoration: "none",
    color: "#FFFFFF",
    border: 0,
    fontSize: "1.5rem",
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.8rem"
    }
  },
  title2: {
    height: "80vh",
    [theme.breakpoints.down("sm")]: {
      height: "inherit"
    }
  },
  symbol: {
    textDecoration: "none",
    color: "#FFFFFF"
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    }
  },
  drawerMobile: {
    justifyContent: "space-evenly",
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-between"
    },
    fontSize: 16
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    background: "#5E366A",
    position: "relative"
  },
  drawerPaperMobile: {
    width: 100,
    background: "#5E366A",
    position: "relative"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  }
}));

export default function AccountNav() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="left"
      >
        <Divider />
        <List component={Link} to="/settings">
          {[""].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {
                  <div className={classes.symbol}>
                    <Subject />
                  </div>
                }
              </ListItemIcon>
              <div className={classes.title}> Settings </div>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List component={Link} to="/billing">
          {[""].map((text, index) => (
            <div className={classes.title2}>
              <ListItem button key={text}>
                <ListItemIcon>
                  {
                    <div className={classes.symbol}>
                      <Payment />
                    </div>
                  }
                </ListItemIcon>
                <div className={classes.title}>Billing </div>
                <ListItemText primary={text} />
              </ListItem>
            </div>
          ))}
        </List>
        <Divider />
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
      </main>
    </div>
  );
}
