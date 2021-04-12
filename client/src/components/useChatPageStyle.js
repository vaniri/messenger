import { makeStyles } from "@material-ui/core/styles";

const useChatPageStyle = makeStyles(theme => ({
    root: {
        minHeight: '95vh',
        '& .MuiInput-underline:before': {
            borderBottom: '1.2px solid rgba(0, 0, 0, 0.2)'
        },
        margin: '20px auto',
        padding: '10px',
        fontWeight: 400,
        fontFamily: 'Open Sans'
    },
    table: {
        minWidth: 650
    },
    chatContiner: {
        height: '300px',
        textAlign: 'center'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        overflowY: 'auto',
        overscrollBehaviorY: 'contain',
        scrollSnapType: 'y proximity',
        height: '75vh',
        maxHeight: '75vh'
    },
    messageItem: {
        margin: '20px 0',
        width: '35%',
        '&:last-child': {
            scrollSnapAlign: 'end'
        },
    },
    textField: {
        backgroundColor: '#ecf4ff',
        outline: 'none'
    },
    chatTextField: {
        backgroundColor: 'lightblue',
        padding: '10px'

    },
    leftAlign: {
        textAlign: 'left',
        marginRight: 'auto',
        color: '#f2f3f3',
        fontWeight: '800'
    },
    rightAlign: {
        textAlign: 'right',
        marginLeft: 'auto',
        fontWeight: '800'
    },
    leftText: {
        backgroundImage:
            'linear-gradient(100deg, #3b8eff 0%, #63beff 100%)',
        borderRadius: '0px 15px 15px 15px'
    },
    rightText: {
        backgroundImage:
            'linear-gradient(100deg, #ecf4ff 0%, #ecf4ff 100%)',
        borderRadius: '15px 15px 0px 15px'
    },
    formContainer: {
        padding: '20px',
        outline: 'none',
        margin: '0 auto'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
        textAlign: 'center',
        outline: 'none',
        overflow: 'visible'
    },
    friendUsernameContainer: {
        flexGrow: 1,
        boxShadow: '2px 2px 3px 0 #1111, 0 3px 10px 0 #E0E0E0',
        fontSize: '60px',
    },
    messageText: {
        padding: '20px'
    },
    friendInfo: {
        color: '#888888'
    }, 
    online: {
        color: 'green',
        textAlign: "right",
        fontSize: "medium"
    },
    offline: {
        color: 'red',
        textAlign: "right",
        fontSize: "medium"
    },
      menuButton: {
        marginRight: theme.spacing(2),
      },
      title: {
        flexGrow: 1,
      },
}));

export default useChatPageStyle;