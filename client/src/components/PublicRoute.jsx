import React from "react";
import { Route, useHistory } from "react-router-dom";

const PublicRoute = ({ component: Component, path, ...rest }) => {
    const history = useHistory();

    const refreshAuth = async () => {
        const res = await fetch('/user/refresh', { method: 'POST' });
        if (res.status === 200) { history.push("/dashboard"); }
    };

    return (
        <Route
            path={path}
            render={routeProps => {
                refreshAuth();
                return <Component {...routeProps} {...rest} />;
            }}
        />
    )
}

export default PublicRoute;