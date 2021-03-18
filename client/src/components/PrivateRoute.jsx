import React, { useState, useEffect } from "react";
import { Route, useHistory, useLocation } from "react-router-dom";

const PrivateRoute = ({ component: Component, path, ...rest }) => {
    const [isSignedIn, setSignedIn] = useState(false);
    const [userInfo, setUserInfo] = useState("");
    const history = useHistory();
    const location = useLocation();

    const refreshAuth = async () => {
        const res = await fetch('/user/refresh', { method: 'POST' });

        if (res.status === 200) {
            setSignedIn(true);
            const userData = await res.json();
            setUserInfo(userData);
        } else {
            setSignedIn(false);
            history.push("/login");
        }
    };

    useEffect(() => setSignedIn(false), [location.pathname]);

    return (
        <Route
            path={path}
            render={routeProps => {
                if (!isSignedIn) {
                    refreshAuth();
                    return <div>Loading...</div>;
                }
                else {
                    return <Component userInfo={userInfo} {...routeProps} {...rest} />;
                }
            }}
        />
    );
}

export default PrivateRoute;