import React from "react";
import { useEffect } from "react";
import { Button, CssBaseline, TextField, Box, Paper, Grid, Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

import useGreetingPagesStyle from "../components/useGreetingPagesStyle";
import useHandleAuthorization from "../components/useHandleAuthorization";
import GreetingSideBar from "../components/GreetingSideBar";
import ButtonHeader from "../components/ButtonHeader";
import SnackBar from "../components/SnackBar";

const Register = () => {

  const classes = useGreetingPagesStyle();

  const signUp = async ({ username, email, password }) => {
    const res = await fetch('http://localhost:3001/user/', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.status === 201) {
      const { userId, token } = await res.json();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("token", token);
    } else if (res.status === 409) {
      throw new Error("User already exists");
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  }

  const { handleFormSubmit, redirect, open, setOpen, message } = useHandleAuthorization({ path: "/dashboard", funct: signUp });

  useEffect(() => redirect(), []);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <GreetingSideBar classes={classes}/>
      <Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
        <Box className={classes.buttonHeader}>
          <ButtonHeader
            classes={classes}
            href="/login"
            questionText="Already have an account?"
            buttonText="Login"
            />

          <Box width="100%" maxWidth={450} p={3} alignSelf="center">
            <Grid container>
              <Grid item xs>
                <Typography
                  className={classes.welcome}
                  component="h1"
                  variant="h5"
                >
                  Create an account
                </Typography>
              </Grid>
            </Grid>
            <Formik
              initialValues={{
                email: "",
                password: ""
              }}
              validationSchema={Yup.object().shape({
                username: Yup.string()
                  .required("Username is required")
                  .max(40, "Username is too long"),
                email: Yup.string()
                  .required("Email is required")
                  .email("Email is not valid"),
                password: Yup.string()
                  .required("Password is required")
                  .max(100, "Password is too long")
                  .min(6, "Password too short")
              })}
              onSubmit={handleFormSubmit}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <form
                  onSubmit={handleSubmit}
                  className={classes.form}
                  noValidate
                >
                  <TextField
                    id="username"
                    label={
                      <Typography className={classes.label}>
                        Username
                      </Typography>
                    }
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{ classes: { input: classes.inputs } }}
                    name="username"
                    autoComplete="username"
                    autoFocus
                    helperText={touched.username ? errors.username : ""}
                    error={touched.username && Boolean(errors.username)}
                    value={values.username}
                    onChange={handleChange}
                  />
                  <TextField
                    id="email"
                    label={
                      <Typography className={classes.label}>
                        E-mail address
                      </Typography>
                    }
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{ classes: { input: classes.inputs } }}
                    name="email"
                    autoComplete="email"
                    helperText={touched.email ? errors.email : ""}
                    error={touched.email && Boolean(errors.email)}
                    value={values.email}
                    onChange={handleChange}
                  />
                  <TextField
                    id="password"
                    label={
                      <Typography className={classes.label}>
                        Password
                      </Typography>
                    }
                    fullWidth
                    margin="normal"
                    InputLabelProps={{
                      shrink: true
                    }}
                    InputProps={{
                      classes: { input: classes.inputs }
                    }}
                    type="password"
                    autoComplete="current-password"
                    helperText={touched.password ? errors.password : ""}
                    error={touched.password && Boolean(errors.password)}
                    value={values.password}
                    onChange={handleChange}
                  />

                  <Box textAlign="center">
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      color="primary"
                      className={classes.submit}
                    >
                      Create
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Box>
          <Box p={1} alignSelf="center" />
        </Box>
        <SnackBar
          setOpen={setOpen}
          open={open}
          message={message}
          />
      </Grid>
    </Grid>
  );
}

export default Register;