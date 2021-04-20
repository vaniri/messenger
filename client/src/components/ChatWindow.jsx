import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { Grid, TextField, InputAdornment, IconButton, List, ListItem, ListItemIcon, ListItemText, Avatar, AppBar, Toolbar } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import useChatPageStyle from "../components/useChatPageStyle";

const ChatWindow = forwardRef(({ userInfo, selectedConv, reportError }, ref) => {
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

    useImperativeHandle(ref, () => ({
        handleMessage: msg => {
            if (msg.conversationId === selectedConv.convId) {
                setMessages([...messages, msg]);
            }
        }
    }));

    return (
        <Grid container item xs={12} sm={9} md={9} elevation={6} className={classes.chatContainer}>
            <Grid container item xs={12}>
                {selectedConv.id ?
                    <AppBar position="sticky" color="default" className={classes.friendUsernameContainer}>
                        <Toolbar>
                            <List>
                                <ListItem>
                                    <ListItemIcon>
                                        <Avatar alt={""} src={""} />
                                    </ListItemIcon>
                                    <ListItemText primary={selectedConv.username}></ListItemText>
                                    <ListItemIcon alignItemsFlexEnd="true"> </ListItemIcon>
                                </ListItem>
                            </List>
                        </Toolbar>
                    </AppBar> : ""}
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
            <Grid container item className={classes.formContainer} xs={12}>
                <form
                    onSubmit={(event) => sendMessage(event)}
                    className={classes.form}
                    noValidate
                >
                    <TextField
                        disabled={!selectedConv.id}
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
});

export default ChatWindow;