import React from "react";
import AppLayout from "../components/layout/AppLayout.jsx";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box bgcolor={"#f4f4f4"} height={"100%"}>
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
};

export default AppLayout(Home);
