import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter as Router } from "react-router-dom";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

const darkTheme = createMuiTheme({
  palette: {
    type: "dark"
  },
  overrides: {
    MuiFormLabel: {
      root: {
        "&$focused": {
          color: "white"
        }
      }
    }
  }
});

ReactDOM.render(
  <React.Fragment>
    <ThemeProvider theme={darkTheme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
