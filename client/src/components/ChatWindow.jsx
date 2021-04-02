import React, { useState, useEffect, useRef } from "react";
import { Grid, TextField, InputAdornment, IconButton, List, ListItem, ListItemIcon, ListItemText, Avatar } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import useChatPageStyle from "../components/useChatPageStyle";

const ChatWindow = ({ userInfo, selectedConv, reportError }) => {
    const classes = useChatPageStyle();
    const [messageBody, setMessageBody] = useState("");
    const [messages, setMessages] = useState([]);
    const messagesRef = useRef(null);

    const handleCreateMessage = event => {
        const { value } = event.target;
        setMessageBody(value);
    }

    const sendMessage = async (event) => {
        event.preventDefault();
        const res = await fetch(`/conversations/${selectedConv.convId}`, {
            method: 'POST',
            body: JSON.stringify({ messageBody }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (res.status === 201) {
            setMessageBody("");
            getMessages();
        } else {
            reportError("Error sending the message");
        }
    }

    const getMessages = async () => {
        if (!selectedConv.id) {
            return;
        }

        const res = await fetch(`/conversations/${selectedConv.convId}`);
        if (res.status === 200) {
            const messagesData = await res.json();
            setMessages(messagesData.messages);
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        } else {
            reportError("Error fetching")
        }
    }

    useEffect(() => getMessages(), [selectedConv]);

    return (
        <Grid container item xs={12} sm={9} md={9} elevation={6} className={classes.chatContainer}>
            <Grid xs={12}>
                {selectedConv.id ?
                    <Grid xs={12} className={classes.friendUsernameContainer}>
                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Avatar alt={""} src={""} />
                                </ListItemIcon>
                                <ListItemText primary={selectedConv.username}></ListItemText>
                                <ListItemIcon alignItemsFlexEnd="true"> <MoreHorizIcon /></ListItemIcon>
                            </ListItem>
                        </List>
                    </Grid> : ""}
                <Grid ref={messagesRef} className={classes.messageArea}>
                    <List>
                        {messages.map(msg => {
                            const fromMyself = msg.from === userInfo.userId;
                            return (
                                <ListItem key={msg.id} className={`${classes.messageItem} ${fromMyself ? classes.rightAlign : classes.leftAlign}`}>
                                    <Grid style={{ width: '100%' }}>
                                        <ListItemText
                                            className={classes.friendInfo}
                                            primary={fromMyself ? userInfo.username : selectedConv.username}
                                        >
                                        </ListItemText>
                                        <ListItemText
                                            className={classes.friendInfo}
                                            primary={`${new Date(msg.createdAt).toLocaleString()}`}
                                        >
                                        </ListItemText>
                                        <Grid>
                                            <ListItemText
                                                className={`${classes.messageText} ${fromMyself ? classes.rightText : classes.leftText}`}
                                                primary={msg.body}
                                            >
                                            </ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                            )
                        })}
                    </List>
                </Grid>
            </Grid>
            <Grid className={classes.formContainer} xs={12}>
                <form
                    onSubmit={(event) => sendMessage(event)}
                    className={classes.form}
                    noValidate
                >
                    <TextField
                        className={classes.textField}
                        id="outlined-basic-email"
                        value={messageBody}
                        placeholder="Type Something"
                        autoFocus={true}
                        autoComplete="off"
                        fullWidth={true}
                        variant="outlined"
                        onChange={handleCreateMessage}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="send"
                                        color="secondary"
                                        type="submit"
                                    >
                                        <SendIcon />
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </form>
            </Grid>
        </Grid >
    )
}

export default ChatWindow;