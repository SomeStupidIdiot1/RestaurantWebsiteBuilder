import React, { useState, useRef, ReactElement } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Typography,
  Container,
  Popper,
  Snackbar,
} from "@material-ui/core";
import { Alert, AlertTitle } from "@material-ui/lab";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { makeStyles } from "@material-ui/core/styles";
import { useMutation } from "@apollo/react-hooks";
import { CREATE_USER } from "../mutations";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  popper: {
    border: "1px solid",
    margin: theme.spacing(1),
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));
export default function RegisterForm() {
  const classes = useStyles();
  const [registerInfo, setRegisterInfo] = useState({
    email: "",
    password: "",
    restaurantName: "",
    address: "",
    phone: "",
    instagram: "",
    youtube: "",
    twitter: "",
    facebook: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [focused, setFocused] = useState("");
  const [response, setResponse] = useState("");
  const [anchorEl, setAnchorEl]: [null | HTMLInputElement, Function] = useState(
    null
  );
  const [register] = useMutation(CREATE_USER, {
    onError: (error) => {
      const msg = error.graphQLErrors[0].message;
      if (msg === "email is not unique")
        setResponse("Email was already registered.");
      else setResponse(msg);
      console.log(msg);
    },
  });
  const passwordInputRef = useRef(null);
  const EMAIL_REGEX = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i; //eslint-disable-line
  const emailHelperText =
    !registerInfo.email.match(EMAIL_REGEX) &&
    focused !== "email" &&
    registerInfo.email !== ""
      ? "This email is invalid"
      : "";
  const getPasswordHelperText = (): ReactElement | string => {
    let requiredParameters: ReactElement[] = [];
    if (registerInfo.password.toLowerCase() === registerInfo.password)
      requiredParameters = requiredParameters.concat(
        <Typography variant="subtitle2" component="p" key="no upper case">
          Needs an uppercase letter.
        </Typography>
      );
    if (registerInfo.password.length < 8 || registerInfo.password.length > 40)
      requiredParameters = requiredParameters.concat(
        <Typography
          variant="subtitle2"
          component="p"
          key="too short or too long"
        >
          Must be between 8 to 40 characters.
        </Typography>
      );
    if (!registerInfo.password.match(/[#?!@$%^&*-]/))
      requiredParameters = requiredParameters.concat(
        <Typography variant="subtitle2" component="p" key="no symbol">
          Contains one of the following: #?!@$%^&*-
        </Typography>
      );
    if (!/\d/.test(registerInfo.password))
      requiredParameters = requiredParameters.concat(
        <Typography variant="subtitle2" component="p" key="no number">
          Needs at least 1 number.
        </Typography>
      );

    const passwordHelperText =
      requiredParameters.length !== 0 && focused === "password" ? (
        <div>{requiredParameters}</div>
      ) : (
        ""
      );
    return passwordHelperText;
  };
  const confirmPasswordHelperText =
    confirmPassword !== registerInfo.password &&
    focused !== "Confirm password" &&
    confirmPassword !== ""
      ? "This does not match the password."
      : "";
  const onSubmit = (event: React.SyntheticEvent<EventTarget>): void => {
    event.preventDefault();
    if (emailHelperText || !registerInfo.email) setResponse("Invalid email");
    else if (
      !registerInfo.password.match(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,40}$/
      )
    )
      setResponse("Invalid password");
    else if (registerInfo.password !== confirmPassword)
      setResponse("Confirmation password does not match");
    else if (!registerInfo.restaurantName)
      setResponse("Needs a restaurant name");
    else
      register({
        variables: registerInfo,
      }).then((res) => {
        if (res) {
          setResponse("Success");
          setRegisterInfo({
            email: "",
            password: "",
            restaurantName: "",
            address: "",
            phone: "",
            instagram: "",
            youtube: "",
            twitter: "",
            facebook: "",
          });
          setConfirmPassword("");
        }
      });
  };
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={onSubmit} noValidate>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Typography component="h2" variant="subtitle1">
                Account Information (required)
              </Typography>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Email Address"
                autoFocus
                type="email"
                value={registerInfo.email}
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, email: target.value })
                }
                helperText={emailHelperText}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused("")}
                error={!!emailHelperText && focused !== "email"}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Password"
                type="password"
                value={registerInfo.password}
                id=""
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, password: target.value })
                }
                onFocus={() => {
                  setFocused("password");
                  setAnchorEl(passwordInputRef.current);
                }}
                onBlur={() => {
                  setFocused("");
                  setAnchorEl(null);
                }}
                error={!!getPasswordHelperText() && focused !== "password"}
                ref={passwordInputRef}
              />
            </Grid>
            <Popper
              open={!!anchorEl && !!getPasswordHelperText()}
              anchorEl={anchorEl}
              placement="left"
              className={classes.popper}
            >
              {getPasswordHelperText()}
            </Popper>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Confirm password"
                value={confirmPassword}
                type="password"
                onChange={({ target }) => setConfirmPassword(target.value)}
                helperText={confirmPasswordHelperText}
                onFocus={() => setFocused("Confirm password")}
                onBlur={() => setFocused("")}
                error={
                  !!confirmPasswordHelperText && focused !== "Confirm password"
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                label="Restaurant Name"
                value={registerInfo.restaurantName}
                onChange={({ target }) =>
                  setRegisterInfo({
                    ...registerInfo,
                    restaurantName: target.value,
                  })
                }
                onBlur={() => setFocused("")}
              />
            </Grid>

            <Grid item xs={12}>
              <br />
              <Typography component="h2" variant="subtitle1">
                Contact Information
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                label="Restaurant Address"
                value={registerInfo.address}
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, address: target.value })
                }
                autoComplete="address"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Phone Number"
                value={registerInfo.phone}
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, phone: target.value })
                }
                autoComplete="phone"
              />
            </Grid>
            <Grid item xs={12}>
              <br />
              <Typography component="h2" variant="subtitle1">
                Social Media
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                value={registerInfo.instagram}
                label="Instagram Link"
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, instagram: target.value })
                }
                autoComplete="instagram"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Twitter Link"
                value={registerInfo.twitter}
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, twitter: target.value })
                }
                autoComplete="twitter"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                label="Facebook Link"
                value={registerInfo.facebook}
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, facebook: target.value })
                }
                autoComplete="facebook"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                value={registerInfo.youtube}
                label="Youtube Link"
                onChange={({ target }) =>
                  setRegisterInfo({ ...registerInfo, youtube: target.value })
                }
                autoComplete="youtube"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="#" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Snackbar
        open={!!response}
        autoHideDuration={6000}
        onClose={() => setResponse("")}
      >
        {response === "Success" ? (
          <Alert severity="success">Success!</Alert>
        ) : (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {response}
          </Alert>
        )}
      </Snackbar>
    </Container>
  );
}
