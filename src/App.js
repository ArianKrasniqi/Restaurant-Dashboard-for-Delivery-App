import React from "react";
import "./App.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Auth from "./pages/Auth";
import Orders from "./pages/Orders";
import Drivers from "./pages/Drivers";
import Archive from "./pages/Archive";
import Users from "./pages/Users";

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/orders" component={Orders} />
        <Route exact path="/" component={Auth} />
        <Route path="/drivers" component={Drivers} />
        <Route path="/users" component={Users} />
        <Route path="/archive" component={Archive} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
