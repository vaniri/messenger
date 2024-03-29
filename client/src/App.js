import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import ChatComponent from "./pages/Chat";

import "./App.css";

const App = () => {

  return (
    <MuiThemeProvider theme={theme}>
      <PublicRoute path="/login" component={Login} />
      <PublicRoute path="/signup" component={Signup} />
      <PrivateRoute path="/dashboard" component={ChatComponent} />
      <Route exact path="/">
        <Redirect to="/signup" />
      </Route>
    </MuiThemeProvider>
  );
}

export default withRouter(App);
