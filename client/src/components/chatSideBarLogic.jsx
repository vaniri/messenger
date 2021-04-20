import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Grid } from "@material-ui/core";
import useChatPageStyle from "../components/useChatPageStyle";
import ChatSideBar from "./ChatSideBar";
import MobileChatSideBar from './MobileChatSideBar';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const ChatSideBarLogic = forwardRef(({ userInfo, setSelectedConv, reportError }, ref) => {
    const classes = useChatPageStyle();
    const [convs, setConvs] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [findUser, setFindUser] = useState("");

    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down('xs'));

    const handleUserSearchChange = event => {
        event.preventDefault();
        const { value } = event.target;
        setFindUser(value);
        if (value.length) { searchUser(value); }
    }

    const searchUser = async (username) => {
        const res = await fetch(`/user/search?username=${username}`);
        if (res.status === 200) {
            const users = await res.json();
            setFoundUsers(users);
        } else {
            reportError("Error finding users")
        }
    }

    const addUser = async (username) => {
        const res = await fetch("/conversations", {
            method: 'PUT',
            body: JSON.stringify({ username }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status === 201 || res.status === 204) {
            getConversations();
            setFindUser("");
        } else {
            reportError(`Error adding ${username} to contacts`);
        }
    }

    const getConversations = async () => {
        const res = await fetch("/conversations");
        if (res.status === 200) {
            const { usersData } = await res.json();
            setConvs(usersData);
        } else {
            reportError("Error finding existing conversations");
        }
    }

    useEffect(() => getConversations(), []);

    useImperativeHandle(ref, () => ({
        handleStatus: userStatus => {
            setConvs(convs.map(conv => {
                if (conv.convId === userStatus.convId) {
                    conv = { ...conv, isOnline: userStatus.isOnline };
                }
                return conv;
            }));
        }
    }));

    return (
        <Grid item xs={12} sm={3} md={3} elevation={6} className={classes.borderRight500} style={{ border: 'none' }}>
            {matches ? <MobileChatSideBar
                userInfo={userInfo}
                findUser={findUser}
                convs={convs}
                foundUsers={foundUsers}
                setSelectedConv={setSelectedConv}
            /> : <ChatSideBar
                    userInfo={userInfo}
                    findUser={findUser}
                    convs={convs}
                    foundUsers={foundUsers}
                    addUser={addUser}
                    handleUserSearchChange={handleUserSearchChange}
                    setSelectedConv={setSelectedConv}
                />}
        </Grid>
    )

});

export default ChatSideBarLogic;