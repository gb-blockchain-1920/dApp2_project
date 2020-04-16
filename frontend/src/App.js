import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar/NavigationBar";
import { Login } from "./container/Login/Login";
import { Aircraft } from "./container/Aircraft/Aircraft";
import { getCompanies } from "./scripts/hyperledger.js";

function App() {
  const [connected, setConnected] = React.useState(false);
  const [list, setList] = React.useState([]);
  const companies = { list, setList };
  const [info, setInfo] = React.useState({});
  const user = { info, setInfo };

  React.useEffect(() => {
    getCompanies()
      .then(res => {
        console.log(res);
        setList(res);
        setConnected(true);
      })
      .catch(e => {
        console.log(e);
        setConnected(false);
        setList(["air canada", "KLM", "united", "delta"]); //offline data for demo purposes
      });
  }, []);

  return (
    <React.Fragment>
      <NavigationBar connected={connected} />
      <Switch>
        <Route path="/aircraft">
          {Object.keys(info).length === 0 ? (
            <Redirect to="/" />
          ) : (
            <Aircraft connected={connected} userData={user} companies={companies}/>
          )}
        </Route>
        <Route path="/">
          <Login connected={connected} companies={companies} userData={user} />
        </Route>
      </Switch>
    </React.Fragment>
  );
}

export default App;
