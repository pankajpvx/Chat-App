import { Menu, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { setIsDeleteMenu } from "../../redux/reducers/misc";
import {
  Delete as DeleteIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAsyncMutation } from "../../hooks/hooks";
import {
  useDeleteChatMutation,
  useLeaveGroupMutation,
} from "../../redux/api/api";

const DeleteChatMenu = ({ dispatch, deleteMenuAnchor }) => {
  const navigate = useNavigate();
  const { isDeleteMenu, selectedDeleteChat } = useSelector(
    (state) => state.misc
  );

  const isGroup = selectedDeleteChat.groupChat;

  const [deleteChat, deleteChatData] = useAsyncMutation(useDeleteChatMutation);

  const [leaveGroup, leaveGroupData] = useAsyncMutation(useLeaveGroupMutation);

  useEffect(() => {
    if (deleteChatData.message || leaveGroupData.message) navigate("/");
  }, [deleteChatData, leaveGroupData]);

  const closeHandler = () => {
    deleteMenuAnchor.current = null;
    dispatch(setIsDeleteMenu(false));
  };

  const onLeaveGroup = () => {
    closeHandler();
    leaveGroup("Leaving Group...", selectedDeleteChat.chatId);
  };

  const onDeleteChat = () => {
    closeHandler();
    deleteChat("Deleting chat...", selectedDeleteChat.chatId);
  };

  return (
    <Menu
      open={isDeleteMenu}
      onClose={closeHandler}
      anchorEl={deleteMenuAnchor.current}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "center",
        horizontal: "center",
      }}
    >
      <Stack
        sx={{
          width: "10rem",
          padding: "0.5rem",
          cursor: "pointer",
        }}
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        onClick={isGroup ? onLeaveGroup : onDeleteChat}
      >
        {isGroup ? (
          <>
            <ExitToAppIcon />
            <Typography>LeaveGroup</Typography>
          </>
        ) : (
          <>
            <DeleteIcon /> <Typography>Delete chat</Typography>
          </>
        )}
      </Stack>
    </Menu>
  );
};

export default DeleteChatMenu;
