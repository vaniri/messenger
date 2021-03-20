import React from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Grid, TextField, InputAdornment, IconButton, ListItemAvatar, List, ListItem, ListItemText, Avatar } from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import useChatPageStyle from './useChatPageStyle';

const ChatWindow = () => {
    const classes = useChatPageStyle();
    const [messageBody, setMessageBody] = useState("");
    const history = useHistory();

    const messeges = [
        { from: "jhon", to: "thomas", body: "Hey man, What's up?", data: "09/13/2000", align: "left", image: "" },
        { from: "jhon", to: "thomas", body: "What a lovelly day!!", data: "09/13/2000", align: "left", image: "" },
        { from: "jhon", to: "thomas", body: "Totally agree with you!", data: "09/13/2000", align: "left", image: "" },
        { from: "thomas", to: "jhon", body: "How are you doing?", data: "10/08/2000", align: "right", image: "" },
        { from: "thomas", to: "jhon", body: "I have no plans for tomorrow", data: "10/08/2000", align: "right", image: "" },
        { from: "thomas", to: "jhon", body: "We can do it on Fridat!", data: "10/08/2000", align: "right", image: "" }
    ];

    const handleCreateMessage = event => {
        const { value } = event.target;
        setMessageBody(value);
    }

    const handlMessageSend = () => {
        sendMessage();
    }

    let handleMessagePost = () => {
        let path = `/postWithComments/${""}`
        history.push("./");
    }

    const sendMessage = async () => {
        try {
            const res = await fetch("./", {
                method: 'POST',
                body: JSON.stringify({ messageBody, to: "", from: "" }),
                headers: { 'Content-Type': 'application/json' }
              });
            if (res.status === "") {
                console.log("Messahe safe!")
                handleMessagePost();
            }
        } catch (err) {
            throw(err);
        }
    }

    return (
        <Grid item xs={9}>
            <List className={classes.messageArea}>
                {messeges.map(message => (
                    <ListItem key="" style={{ margin: '20px 0' }}>
                        <Grid container>
                            <ListItemAvatar>
                                <Avatar alt={""} src={message.image} />
                            </ListItemAvatar>
                            <ListItemText align={message.align} primary={`${message.from} ${message.data}`}></ListItemText>
                            <Grid item xs={12}>
                                <ListItemText align={message.align} primary={message.body}></ListItemText>
                            </Grid>
                        </Grid>
                    </ListItem>
                ))}
            </List>

            <Grid container style={{ padding: '20px' }}>
                <Grid item xs={12} align="">
                    <form
                        onSubmit={() => handlMessageSend()}
                        className={classes.form}
                        noValidate
                    >
                        <TextField
                            className={classes.textField}
                            id="outlined-basic-email"
                            value={messageBody}
                            placeholder="Type Something"
                            variant="outlined"
                            fullWidth
                            onChange={handleCreateMessage}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="send"
                                            color="primary"
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
            </Grid>
        </Grid>
    )
}

export default ChatWindow;