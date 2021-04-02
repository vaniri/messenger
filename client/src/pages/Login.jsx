import React from "react";
import { Button, CssBaseline, TextField, Paper, Grid, Typography } from "@material-ui/core";
import { Formik } from "formik";
import * as Yup from "yup";

import useGreetingPagesStyle from "../components/useGreetingPagesStyle";
import useHandleAuthorization from "../components/useHandleAuthorization";
import GreetingSideBar from "../components/GreetingSideBar";
import ButtonHeader from "../components/ButtonHeader";
import SnackBar from "../components/SnackBar";


const Login = () => {
  const classes = useGreetingPagesStyle();

  const login = async ({ email, password }) => {
    const res = await fetch('/user/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    });
    if (res.status === 404 || res.status === 401) {
      throw new Error("Wrong credentials");
    } else if (res.status !== 200) {
      throw new Error("Unable to login");
    }
  };

  const { handleFormSubmit, open, setOpen, message } = useHandleAuthorization({ path: "/dashboard", funct: login });

  return (
    <Grid container component="main" className={classes.root}>
      <CssBaseline />
      <GreetingSideBar classes={classes} />
      <Grid item xs={9} sm={8} md={7} elevation={6} component={Paper} square>
        <Grid className={classes.buttonHeader}>
          <ButtonHeader
            classes={classes}
            href="/signup"
            questionText="Don't have an account?"
            buttonText="Create account"
          />
        </Grid>
        <Grid container className={classes.box}>
          <Grid item container xs={9}>
            <Grid container>
              <Typography className={classes.welcome} component="h1" variant="h5">
                Welcome back!
                </Typography>
            </Grid>
            <Grid>
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
                    <Grid>
                      <Button
                        type="submit"
                        size="large"
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                      >
                        Login
                    </Button>
                    </Grid>

                    <div style={{ height: 95 }} />
                  </form>
                )}
              </Formik>
            </Grid>
          </Grid>
        </Grid>
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