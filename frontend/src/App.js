import React from "react";
import { Switch, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { Login } from "./container/Login/Login";
import { Aircraft } from "./container/Aircraft/Aircraft";
import { getCompanies } from "./scripts/hyperledger.js";

function App() {
  const [connected, setConnected] = React.useState(false);
  const [list, setList] = React.useState([]);
  const companies = { list, setList };

  React.useEffect(() => {
    try {
      getCompanies().then(res => {
        setList(res);
        setConnected(true);
      });
    } catch (e) {
      setConnected(false);
    }
  }, [])

  return (
    <React.Fragment>
      <NavigationBar connected={connected} />
      <Switch>
        <Route path="/aircraft">
          <Aircraft />
        </Route>
        <Route path="/">
          <Login companies={companies} />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
