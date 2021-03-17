import React from "react";
import { Link } from "react-router-dom";
import { Button, Box } from "@material-ui/core";


const ButtonHeader = ({ href, questionText, buttonText, classes }) => {
  return (
    <Box p={1} alignSelf="flex-end" alignItems="center">
      <Link to={href} className={classes.link}>
        <Button className={classes.noAccBtn}>
          {questionText}
        </Button>
        <Button
          color="primary"
          className={classes.accBtn}
          variant="contained"
        >
          {buttonText}
        </Button>
      </Link>
    </Box>
  );
};

export default ButtonHeader;