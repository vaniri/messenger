import React from "react";
import { useHistory } from "react-router-dom";

const LogOut = () => {
    const history = useHistory();

    const logout = async () => {
        await fetch('/user/logout', { method: 'POST' });
        history.push('/login');
    };

    return (
        <button onClick={logout}>
            Logout
        </button>
    )
}

export default LogOut;