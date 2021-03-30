import React, { useState } from "react";
import { Grid } from "@material-ui/core";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import useChatPageStyle from "../components/useChatPageStyle";
import SnackBar from "../components/SnackBar";

const ChatComponent = ({ userInfo }) => {
    const classes = useChatPageStyle();
    const [selectedConv, setSelectedConv] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const reportError = (error) => {
        setErrorMessage(error);
        setSnackbarOpen(true);
    };

    return (
        <Grid container item xs={12} sm={12} md={12} elevation={6} className={classes.root}>
            <ChatSideBar userInfo={userInfo} setSelectedConv={setSelectedConv} reportError={reportError} />
            <ChatWindow userInfo={userInfo} selectedConv={selectedConv} reportError={reportError} />
            <SnackBar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={errorMessage}
            />
        </Grid>
    )
}

export default ChatComponent;