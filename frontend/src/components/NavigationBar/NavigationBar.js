import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tooltip
} from "@material-ui/core";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import RssFeedIcon from "@material-ui/icons/RssFeed";
import "./NavigationBar.css";

export const NavigationBar = ({connected}) => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <FlightTakeoffIcon fontSize="large" />
        <Typography variant="h6" className="heading-web">
          Airline MRO + Hyperledger Fabric
        </Typography>
        <Typography variant="h6" className="heading-mobile">
          Airline MRO
        </Typography>
        <Box px={2}>
          <Button color="inherit">Login</Button>
        </Box>
        <Tooltip title={connected ? "Network Connected" : "Not Connected"}>
          <RssFeedIcon color={connected ? "inherit" : "secondary"} />
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
