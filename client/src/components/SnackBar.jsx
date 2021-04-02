import React from "react";
import { Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const SnackBar = ({ setOpen, open, message }) => {  

    const handleClose = (event, reason) => {
      if (reason === "clickaway") { return; }
      setOpen(false);
    };
    
    return (
        <Snackbar
        anchorOrigin={{
        vertical: "bottom",
        horizontal: "center"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message={message}
        action={
            <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={handleClose}
            >
            <CloseIcon fontSize="small" />
            </IconButton>
        }
        />
    )
}

export default SnackBar ;

