import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100dvh" }}>
      <Stack sx={{ height: "100%" }} alignItems={"center"} spacing={"1rem"}>
        <ErrorIcon sx={{ fontSize: "8rem" }} />
        <Typography variant="h1">404</Typography>
        <Typography variant="h3">Not Found</Typography>
        <Link to={"/"}> Go back to home page</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
