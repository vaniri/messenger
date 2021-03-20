import { makeStyles } from "@material-ui/core/styles";

const useChatPageStyle = makeStyles({
    root: {
        minHeight: "100vh",
        "& .MuiInput-underline:before": {
            borderBottom: "1.2px solid rgba(0, 0, 0, 0.2)"
        }
    },
    table: {
        minWidth: 650,
    },
    chatSection: {
        margin: '3vh',
        width: '100%',
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '88%',
        overflowY: 'auto',
    },
    textField: {
        backgroundColor: '#e8f0f8',
    },
    chatTextField: {
        backgroundColor: "lightblue",
        padding: '10px',
        borderRadius: '15px'
    }
});

export default useChatPageStyle;