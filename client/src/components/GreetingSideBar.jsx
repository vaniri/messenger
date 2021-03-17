import React from "react";
import { Box, Hidden, Grid, Typography } from "@material-ui/core";


const GreetingSideBar = ({ classes }) => {
  return (
    <Grid item xs={false} sm={4} md={5} className={classes.image}>
      <Box className={classes.overlay}>
        <Hidden xsDown>
          <img width={67} src="/images/chatBubble.png" alt={""} />
          <Hidden smDown>
            <Typography className={classes.heroText}>
              Converse with anyone with any language
              </Typography>
          </Hidden>
        </Hidden>
      </Box>
    </Grid>
  )
}

export default GreetingSideBar;