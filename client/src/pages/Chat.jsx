import React, { useState, useEffect, useRef } from "react";
import { Grid } from "@material-ui/core";
import ChatSideBar from "../components/ChatSideBar";
import ChatWindow from "../components/ChatWindow";
import useChatPageStyle from "../components/useChatPageStyle";
import SnackBar from "../components/SnackBar";
import socketIOClient from "socket.io-client";

const ChatComponent = ({ userInfo }) => {
    const classes = useChatPageStyle();
    const [selectedConv, setSelectedConv] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const sideBarRef = useRef(null);
    const chatWinRef = useRef(null);

    const reportError = (error) => {
        setErrorMessage(error);
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const socket = socketIOClient("/");
        socket.on("IncomingMessage", msg => chatWinRef.current.handleMessage(msg));
        socket.on("UserStatus", msg => sideBarRef.current.handleStatus(msg));
        
        return () => { if (socket.connected) { socket.disconnect(); } };
    }, []);

    return (
        <Grid container item xs={12} sm={12} md={12} elevation={6} className={classes.root}>
            <ChatSideBar ref={sideBarRef} userInfo={userInfo} setSelectedConv={setSelectedConv} reportError={reportError} />
            <ChatWindow ref={chatWinRef} userInfo={userInfo} selectedConv={selectedConv} reportError={reportError} />
            <SnackBar
                open={snackbarOpen}
                setOpen={setSnackbarOpen}
                message={errorMessage}
            />
        </Grid>
    )
}

export default ChatComponent;