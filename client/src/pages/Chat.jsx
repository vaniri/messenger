import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import useChatPageStyle from "../components/useChatPageStyle";
import SnackBar from "../components/SnackBar";

const ChatComponent = ({ userInfo }) => {
    const classes = useChatPageStyle();
    const [selectedUser, setSelectedUser] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const reportError = (error) => {
        setErrorMessage(error);
        setSnackbarOpen(true);
    };

    return (
        <Grid container xs={12} className={classes.root}>
            <ChatSideBar userInfo={userInfo} setSelectedUser={setSelectedUser} reportError={reportError} />
            <ChatWindow userInfo={userInfo} selectedUser={selectedUser} reportError={reportError} />
            <SnackBar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={errorMessage}
            />
        </Grid>
    )
}

export default ChatComponent;