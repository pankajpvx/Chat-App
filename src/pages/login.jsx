import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt } from "@mui/icons-material";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHeadenInput } from "../components/styled/VisuallyHeadenInput";
import { mainBgColor } from "../constants/colors";
import { server } from "../constants/config";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const avatar = useFileHandler("single");

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };
    const toastId = toast.loading("...Signing in");
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data.message || "something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const toastId = toast.loading("...Signing Up");
    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (err) {
      toast.error(err?.response?.data.message || "something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: mainBgColor,
      }}
    >
      <Container
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5"> Login </Typography>
              <form style={{ width: "100%" }} onSubmit={handleSignIn}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  label="Username"
                  value={username.value}
                  onChange={username.changeHandler}
                  margin="normal"
                  variant="outlined"
                />
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}

                <TextField
                  required
                  size="small"
                  fullWidth
                  value={password.value}
                  onChange={password.changeHandler}
                  label="Password"
                  type="password"
                  margin="normal"
                  variant="outlined"
                />

                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  disabled={isLoading}
                  fullWidth
                  size="small"
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Login
                </Button>

                <Typography textAlign="center" m="1rem">
                  OR
                </Typography>

                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={toggleLogin}
                >
                  Sign Up
                </Button>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5">Sign Up</Typography>
              <form style={{ width: "100%" }} onSubmit={handleSignUp}>
                <Stack position={"relative"} width={"5rem"} margin={"auto"}>
                  <Avatar
                    sx={{ width: "5rem", height: "5rem", objectFit: "cover" }}
                    src={avatar.preview}
                  />
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "white",
                      bgcolor: "rgba(0,0,0,0.5)",
                      ":hover": {
                        bgcolor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    component="label"
                  >
                    <CameraAlt sx={{ width: "0.7rem", height: "0.7rem" }} />
                    <VisuallyHeadenInput
                      type="file"
                      onChange={avatar.changeHandler}
                    />
                  </IconButton>
                </Stack>

                <TextField
                  required
                  fullWidth
                  label="Name"
                  value={name.value}
                  onChange={name.changeHandler}
                  margin="normal"
                  size="small"
                  variant="outlined"
                />
                <TextField
                  required
                  size="small"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  size="small"
                  fullWidth
                  value={username.value}
                  onChange={username.changeHandler}
                  label="Username"
                  margin="normal"
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type="password"
                  value={password.value}
                  onChange={password.changeHandler}
                  margin="normal"
                  size="small"
                  variant="outlined"
                />
                <Button
                  sx={{
                    marginTop: "1rem",
                  }}
                  fullWidth
                  size="small"
                  disabled={isLoading}
                  variant="contained"
                  color="primary"
                  type="submit"
                >
                  Create Account
                </Button>
                <Typography textAlign="center" m="1rem">
                  OR
                </Typography>
                <Button
                  fullWidth
                  variant="text"
                  size="small"
                  color="primary"
                  onClick={toggleLogin}
                >
                  Sign In
                </Button>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default Login;
