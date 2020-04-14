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
import { useHistory, useLocation } from "react-router-dom";

export const NavigationBar = ({ connected }) => {
  const history = useHistory();
  const location = useLocation();
  const logout = () => {
    window.sessionStorage.removeItem('jwt');
    history.push("/");
    console.log("logout callback");
  };

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
          {location.pathname === "/aircraft" && (
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          )}
        </Box>
        <Tooltip title={connected ? "Network Connected" : "Not Connected"}>
          <RssFeedIcon color={connected ? "inherit" : "secondary"} />
        </Tooltip>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationBar;
