import React from "react";
import { Switch, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { Login } from "./container/Login/Login";

function App() {
  const [connected, setConnected] = React.useState(false);

  React.useState(() => {
    //check hyperledger status
    setConnected(false);
  });

  return (
    <React.Fragment>
      <NavigationBar connected={connected} />
      <Switch>
        <Route path="/aircraft"></Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
