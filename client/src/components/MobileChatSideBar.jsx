import React from "react";
import { Grid, List, ListItem, ListItemAvatar, ListItemText, Avatar, SwipeableDrawer, AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import useChatPageStyle from "../components/useChatPageStyle";
import LogOut from "../components/LogOut";

const MobileChatSideBar = ({ userInfo, findUser, convs, foundUsers, addUser, setSelectedConv }) => {
    const classes = useChatPageStyle();
    const { username, userImage, userId } = userInfo;
    const [state, setState] = React.useState({
        top: false,
    });

    const toggleDrawer = (side, open) => event => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    const fullList = side => (
        <div
            className={classes.fullList}
            role="presentation"
            onClick={toggleDrawer(side, false)}
            onKeyDown={toggleDrawer(side, false)}
        >
            <List className={classes.friendsList}>
                {(findUser.length ? foundUsers : convs).map(conv => (
                    <ListItem button
                        key={conv.id}
                        alignItems="flex-start"
                        onClick={() => { findUser.length ? addUser(conv.username) : setSelectedConv(conv) }}>
                        <ListItemAvatar>
                            <Avatar alt={""} src={""} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={conv.username}
                            secondary={conv.message}
                        ></ListItemText>
                        <ListItemText style={{ textAlign: "right" }} >
                            <FiberManualRecordIcon className={conv.isOnline ? classes.online : classes.offline} />
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <Grid container className={classes.nav}>
            <AppBar position="static" color="transparent">
                <Toolbar>
                    <IconButton onClick={toggleDrawer('top', true)}>
                        <MenuIcon />
                    </IconButton>
                    <SwipeableDrawer
                        anchor="top"
                        open={state.top}
                        onClose={toggleDrawer('top', false)}
                        onOpen={toggleDrawer('top', true)}
                    >
                        {fullList('top')}
                    </SwipeableDrawer>
                    <IconButton
                        aria-label="Account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {username}
                    </Typography>
                    <div>
                        <LogOut />
                    </div>
                </Toolbar>
            </AppBar>
        </Grid>
    );
};

export default MobileChatSideBar;
