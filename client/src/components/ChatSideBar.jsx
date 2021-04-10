import React, { useState, useEffect } from "react";
import { Grid, TextField, Typography, List, ListItem, ListItemIcon, ListItemAvatar, ListItemText, Avatar, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import useChatPageStyle from "../components/useChatPageStyle";
import LogOut from "../components/LogOut";

const ChatSideBar = ({ userInfo, setSelectedConv, reportError }) => {
    const classes = useChatPageStyle();
    const [convs, setConvs] = useState([]);
    const [foundUsers, setFoundUsers] = useState([]);
    const [findUser, setFindUser] = useState("");
    const { username, userImage, userId } = userInfo;

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
            console.log(usersData)
            setConvs(usersData);
        } else {
            reportError("Error finding existing conversations");
        }
    }

    useEffect(() => getConversations(), []);

    return (
        <Grid item xs={12} sm={3} md={3} elevation={6} className={classes.borderRight500} style={{ border: 'none' }}>
            <Grid container>
                <List style={{ width: '100%' }}>
                    <ListItem key={userId}>
                        <ListItemIcon>
                            <Avatar alt={username} src={userImage} />
                        </ListItemIcon>
                        <ListItemText primary={username}></ListItemText>
                        <LogOut />
                    </ListItem>
                </List>
            </Grid>
            <Grid style={{ padding: '10px' }}>
                <Typography style={{ marginBottom: '20px' }} variant="h5" className="header-message">Chats</Typography>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        addUser(findUser);
                    }}
                    className={classes.form}
                    noValidate
                >
                    <TextField
                        className={classes.textField}
                        onChange={handleUserSearchChange}
                        id="username"
                        name="username"
                        placeholder="Search"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            )
                        }}
                    />
                </form>
            </Grid>
            <Grid>
                <List>
                    {(findUser.length ? foundUsers : convs).map(conv => (
                        <ListItem button
                            key={conv.id}
                            alignItems="flex-start"
                            onClick={() => { findUser.length ? addUser(conv.username) : setSelectedConv(conv) }}>
                            <ListItemAvatar>
                                <Avatar alt={"Remy Sharp"} src={conv.image} />
                            </ListItemAvatar>
                            <ListItemText
                                primary={conv.username}
                                secondary={conv.message}
                            ></ListItemText>
                            <ListItemText style={{ textAlign: "right"}} >
                                <FiberManualRecordIcon className={conv.isOnline ? classes.online : classes.offline} />
                            </ListItemText>
                        </ListItem>
                    ))}
                </List>
            </Grid>
        </Grid>
    );
}

export default ChatSideBar;