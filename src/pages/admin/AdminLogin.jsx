import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { mainBgColor } from "../../constants/colors";
import { useInputValidation } from "6pp";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, verifyLogin } from "../../redux/thunk.js/auth";

const AdminLogin = () => {
  const secretKey = useInputValidation("");
  const { isAdmin } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey));
  };

  useEffect(() => {
    dispatch(verifyLogin());
  }, []);

  if (isAdmin) return <Navigate to="/admin/dashboard" />;

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
          <Typography variant="h5">Admin Login </Typography>
          <form style={{ width: "100%" }} onSubmit={submitHandler}>
            <TextField
              required
              size="small"
              fullWidth
              value={secretKey.value}
              onChange={secretKey.changeHandler}
              label="Secret Key"
              type="password"
              margin="normal"
              variant="outlined"
            />

            <Button
              sx={{
                marginTop: "1rem",
              }}
              fullWidth
              size="small"
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
