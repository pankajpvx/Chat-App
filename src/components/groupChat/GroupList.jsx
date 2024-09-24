import { Stack, Typography } from "@mui/material";
import React from "react";
import GroupListItem from "./GroupListItem";
import { mainBgColor } from "../../constants/colors";

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    style={{ width: w }}
    sx={{
      backgroundImage: mainBgColor,
      height: "100vh",
      overflowY: "auto",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => <GroupListItem group={group} chatId={chatId} />)
    ) : (
      <Typography textAlign={"center"} padding={"1rem"}>
        No Groups
      </Typography>
    )}
  </Stack>
);

export default GroupList;
