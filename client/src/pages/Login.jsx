import React from "react";
import { useEffect } from "react";
import { Button, CssBaseline, TextField, Paper, Box, Grid, Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

import useGreetingPagesStyle from "../components/useGreetingPagesStyle";
import useHandleAuthorization from "../components/useHandleAuthorization";
import GreetingSideBar from "../components/GreetingSideBar";
import ButtonHeader from "../components/ButtonHeader";
import SnackBar from "../components/SnackBar";


const Login = () => {
  const classes = useGreetingPagesStyle ();

  const login = async ({ email, password }) => {
    const res = await fetch('http://localhost:3001/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (res.status === 200) {
      const { userId, username, userImage, token } = await res.json();
      localStorage.setItem("userId", userId);
      localStorage.setItem("username", username);
      localStorage.setItem("userImage", userImage);
      localStorage.setItem("token", token);
    } else if (res.status === 404) {
      throw new Error ("User not found");
    } else if (res.status === 401) {
      throw new Error ("Invalid password");
    } else {
      const { message } = await res.json();
      throw new Error(message);
    }
  };

  const { handleFormSubmit, redirect, open, setOpen, message } = useHandleAuthorization({ path: "/dashboard", funct: login });
  
  useEffect(() => redirect(), []);

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <GreetingSideBar classes={classes}/>
      <Grid item xs={12} sm={8} md={7} elevation={6} component={Paper} square>
        <Box className={classes.buttonHeader}>
          <ButtonHeader
            classes={classes}
            href="/signup"
            questionText="Don't have an account?"
            buttonText="Create account"
            />

          <Box width="100%" maxWidth={450} p={3} alignSelf="center">
            <Grid container>
              <Grid item xs>
                <p className={classes.welcome} component="h1" variant="h5">
                  Welcome back!
                </p>
              </Grid>
            </Grid>
            <Formik
              initialValues={{
                email: "",
                password: ""
              }}
              validationSchema={Yup.object().shape({
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
                    id="email"
                    label={<p className={classes.label}>E-mail address</p>}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ classes: { input: classes.inputs } }}
                    name="email"
                    autoComplete="email"
                    autoFocus
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
                      classes: { input: classes.inputs },
                      endAdornment: (
                        <Typography className={classes.forgot}>
                          Forgot?
                        </Typography>
                      )
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
                      Login
                    </Button>
                  </Box>

                  <div style={{ height: 95 }} />
                </form>
              )}
            </Formik>
          </Box>
          <Box p={1} alignSelf="center" />
        </Box>
        <SnackBar
          open={open}
          setOpen={setOpen}
          message={message}
          />
      </Grid>
    </Grid>
  );
};

export default Login;