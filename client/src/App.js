import React, { useEffect, useState } from "react";
import { Route, Redirect, useHistory, useLocation, withRouter } from "react-router-dom";
import { MuiThemeProvider } from "@material-ui/core";
import { theme } from "./themes/theme.js";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";

import "./App.css";

const App = () => {
  const [isSignedIn, setSignedIn] = useState(false);
  const [isLoggingOut, setLoggingOut] = useState(false);
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const history = useHistory();
  const location = useLocation();

  const refreshAuth = async () => {
    const res = await fetch('/user/refresh', { method: 'POST' });

    if (res.status === 200) {
      const { username, userImage } = await res.json();
      setSignedIn(true);
      setUsername(username);
      setUserImage(userImage);
    } else {
      setSignedIn(false);
      history.push("/login");
    }
  };

  const logout = async () => {
    await fetch('/user/logout', { method: 'POST' });

    setLoggingOut(true);
    try {
      history.push('/login');
    } finally {
      setLoggingOut(false);
      setSignedIn(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && !isLoggingOut) { console.log(2); refreshAuth(); }
  }, [location.pathname]);

  return (
    <MuiThemeProvider theme={theme}>
      <Route path="/login" render={() => (<Login setUserId={setUserId} setUsername={setUsername} setUserImage={setUserImage} />)} />
      <Route path="/signup" render={() => (<Signup setUserId={setUserId} setUsername={setUsername} setUserImage={setUserImage} />)} />
      <PrivateRoute path="/dashboard"
        isSignedIn={isSignedIn}
        refreshAuth={refreshAuth}
        component={Dashboard}
        userId={userId}
        username={username}
        userImage={userImage}
        logout={logout}
      />
      <Route exact path="/">
        <Redirect to="/signup" />
      </Route>
    </MuiThemeProvider>
  );
}

export default withRouter(App);
