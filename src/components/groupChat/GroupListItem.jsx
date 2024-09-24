import React, { memo } from "react";
import { Link } from "../styled/VisuallyHeadenInput";
import AvatarIcon from "../common/AvatarIcon";
import { Stack, Typography } from "@mui/material";

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      key={_id}
      to={`?group=${_id}`}
      style={{ backgroundColor: _id === chatId ? "#c8b3b3" : "" }}
      onClick={(e) => {
        if (_id === chatId) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarIcon avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default GroupListItem;
