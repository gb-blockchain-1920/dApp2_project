import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { HashRouter as Router } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark",
    text: {
      main: "#fff",
    }
  },
  overrides: {
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "white"
        }
      }
    },
    MuiTooltip: {
      tooltip: {
        fontSize: "1em",
      }
    }
  }
});

ReactDOM.render(
  <ThemeProvider theme={darkTheme}>
    <Router basename="/">
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
