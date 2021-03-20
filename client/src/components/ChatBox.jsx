import React from "react";
import { useState, useEffect } from "react";
import { Grid, TextField, Typography, List, ListItem, ListItemIcon, ListItemAvatar, ListItemText, Avatar, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import useChatPageStyle from "../components/useChatPageStyle";
import ChatWindow from "./ChatWindow";


const Chat = () => {
    const classes = useChatPageStyle();
    const [ users, setUsers ] = useState("");

    const getUsers = async () => {
        try {
            const res = await fetch("./users");
            if (res.status === "") {
                let usersData = await res.json();
                setUsers(usersData);
            } else {
                console.log(res.err);
            }
        } catch (err) {
            throw(err);
        }
    }

    useEffect(() => getUsers(), [users]);


    const usersDefolt = [
        { username: "thomas", message: "", status: "offline", image: "../public/assets2/images/b1f0e680702e811aa8ba333cb19c0e0ea95e8e31.png" },
        { username: "santoago", message: "typing...", status: "online", image: "../../public/assets2/images/775db5e79c5294846949f1f55059b53317f51e30.png" },
        { username: "chiumbo", message: "Sure! What time?", status: "online", image: "../../public/assets2/images/8bc2e13b8ab74765fd57f0880f318eed1c3fb001.png" },
        { username: "hualing", message: "Hi!!!", status: "offline", image: "../../public/assets2/images/6c4faa7d65bc24221c3d369a8889928158daede4.png" },
        { username: "ashanti", message: "Sent photo", status: "online", image: "../../public/assets2/images/68f55f7799df6c8078a874cfe0a61a5e6e9e1687.png" },
        { username: "julia", message: "Do you have any plans?", status: "online", image: "../../public/assets2/images/d9fc84a0d1d545d77e78aaad39c20c11d3355074.png" }
    ];


    return (
        <Grid container className={classes.root}>
            <Grid item xs={3} className={classes.borderRight500}>
                <Grid container>
                    <List>
                        <ListItem key={usersDefolt[0].username}>
                            <ListItemIcon>
                                <Avatar alt={usersDefolt[0].username} src={usersDefolt[0].image} />
                            </ListItemIcon>
                            <ListItemText primary={usersDefolt[0].username}></ListItemText>
                        </ListItem>
                    </List>
                </Grid>
                <Grid item xs={12} style={{ padding: '10px' }}>
                    <Grid container>
                        <Typography style={{ marginBottom: '20px' }} variant="h5" className="header-message">Chats</Typography>
                    </Grid>
                    <Grid container>
                        <TextField
                            className={classes.textField}
                            id="outlined-basic-email"
                            placeholder="Search"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid>
                    <List>
                        {usersDefolt.map(user => (
                            <ListItem button key={user.username} alignItems="flex-start">
                                <ListItemAvatar>
                                    <Avatar alt={"Remy Sharp"} src={user.image} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={user.username}
                                    secondary={user.message}
                                ></ListItemText>
                                <ListItemText secondary={user.status} align="right"></ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
            <ChatWindow />
        </Grid>
    );
}

export default Chat;