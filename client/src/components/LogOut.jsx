import React from "react";
import { useHistory } from "react-router-dom";
import { IconButton } from "@material-ui/core";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const LogOut = () => {
    const history = useHistory();

    const logout = async () => {
        await fetch('/user/logout', { method: 'POST' });
        history.push('/login');
    };

    return (
        <IconButton
            onClick={logout}
            aria-label="send"
            color="secondary"
            type="submit"
        >
            <ExitToAppIcon />
        </IconButton>
    )
}

export default LogOut;