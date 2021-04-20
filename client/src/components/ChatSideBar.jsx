import React from "react";
import { Grid, TextField, Typography, List, ListItem, ListItemIcon, ListItemAvatar, ListItemText, Avatar, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import useChatPageStyle from "../components/useChatPageStyle";
import LogOut from "../components/LogOut";

const ChatSideBar = ({ userInfo, findUser, convs, foundUsers, addUser, handleUserSearchChange, setSelectedConv }) => {
    const classes = useChatPageStyle();
    const { username, userImage, userId } = userInfo;

    return (
        <Grid>
            <Grid container>
                <List style={{ width: '100%' }}>
                    <ListItem key={userId}>
                        <ListItemIcon>
                            <Avatar alt={""} src={""} />
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
                <List className={classes.friendsList}>
                    {(findUser.length ? foundUsers : convs).map(conv => (
                        <ListItem button
                            key={conv.id}
                            alignItems="flex-start"
                            onClick={() => { findUser.length ? addUser(conv.username) : setSelectedConv(conv) }}>
                            <ListItemAvatar className>
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
};

export default ChatSideBar;
