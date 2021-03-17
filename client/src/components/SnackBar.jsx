import React from "react";
import { Paper, Snackbar, Grid, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const SnackBar = ({ setOpen, open, message }) => {  

    const handleClose = (event, reason) => {
      if (reason === "clickaway") { return; }
      setOpen(false);
    };
    
    return (
        <Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
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
        </Grid>
    )
}

export default SnackBar ;

