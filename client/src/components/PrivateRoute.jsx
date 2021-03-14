import React from "react";
import { Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, isSignedIn, refreshAuth, path, ...rest }) => {
    return (
        <Route
            path={path}
            render={routeProps => {
                if (!isSignedIn) {
                    console.log(1);
                    refreshAuth();
                    return <div>Loading...</div>;
                }
                else {
                    return <Component {...routeProps} {...rest} />;
                }
            }}
        />
    );
}

export default PrivateRoute;