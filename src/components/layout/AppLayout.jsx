import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Title from "../common/Title";
import Header from "./Header";
import { Drawer, Grid } from "@mui/material";
import ChatList from "../ChatList";
import { useNavigate, useParams } from "react-router-dom";
import Profile from "../Profile";
import { useMyChatsQuery } from "../../redux/api/api";
import LayoutLoader from "./LayoutLoader";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";
import { useError } from "../../hooks/useError";
import { getSocket } from "../../socket";
import { useSocketEvents } from "../../hooks/hooks";
import {
  CHAT_JOINED,
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";
import {
  incrementNotificationCount,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";
import { getOrSaveFromStorage } from "../../utils/features";
import DeleteChatMenu from "../dialogs/DeleteChatMenu";

const AppLayout = (WrappedComponent) => (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const chatId = params?.chatId;
  const { isMobile } = useSelector((state) => state.misc);
  const { user } = useSelector((state) => state.auth);
  const { newMessageAlerts } = useSelector((state) => state.chat);
  const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");
  const socket = getSocket();
  const deleteMenuAnchor = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useError([{ isError, error }]);

  useEffect(() => {
    if (!isError && !isLoading && data?.chats.length > 0) {
      const myFriends = [];
      data?.chats.forEach(({ members, groupChat }) => {
        if (!groupChat) {
          const otherMember = members.find(
            (member) => member.toString() !== user._id.toString()
          );
          myFriends.push(otherMember);
        }
      });
      socket.emit(CHAT_JOINED, myFriends);
    }
  }, [data]);

  useEffect(() => {
    getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessageAlerts });
  }, [newMessageAlerts]);

  function handleDeleteChat(e, chatId, groupChat) {
    dispatch(setIsDeleteMenu(true));
    dispatch(setSelectedDeleteChat({ chatId, groupChat }));
    deleteMenuAnchor.current = e.currentTarget;
  }

  const handleMobileClose = () => dispatch(setIsMobile(false));

  const newMessageAlertListener = useCallback(
    (data) => {
      if (data.chatId === chatId) return;
      dispatch(setNewMessagesAlert(data));
    },
    [chatId]
  );

  const newRequestListener = useCallback(
    (data) => {
      dispatch(incrementNotificationCount());
    },
    [dispatch]
  );

  const refetchChatListener = useCallback(
    (data) => {
      refetch();
      navigate("/");
    },
    [refetch]
  );

  const onlineUsersListener = useCallback((data) => {
    setOnlineUsers(data);
  }, []);

  const eventHandlers = useMemo(
    () => ({
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchChatListener,
      [ONLINE_USERS]: onlineUsersListener,
    }),
    [chatId]
  );

  useSocketEvents(socket, eventHandlers);

  return (
    <div>
      <Title />
      <Header />

      <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

      <Drawer open={isMobile} onClose={handleMobileClose}>
        {isLoading ? (
          <LayoutLoader />
        ) : (
          <ChatList
            w="70vw"
            chats={data?.chats}
            chatId={chatId}
            onlineUsers={onlineUsers}
            newMessageAlerts={newMessageAlerts}
            handleDeleteChat={handleDeleteChat}
          />
        )}
      </Drawer>

      <Grid container height={"calc(100vh - 4rem)"}>
        <Grid
          item
          sm={4}
          md={3}
          sx={{ display: { xs: "none", sm: "block" } }}
          height={"100%"}
        >
          {isLoading ? (
            <LayoutLoader />
          ) : (
            <ChatList
              chats={data?.chats}
              chatId={chatId}
              onlineUsers={onlineUsers}
              newMessageAlerts={newMessageAlerts}
              handleDeleteChat={handleDeleteChat}
            />
          )}
        </Grid>

        <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
          <WrappedComponent {...props} user={user} chatId={chatId} />
        </Grid>
        <Grid
          item
          md={4}
          lg={3}
          height={"100%"}
          bgcolor={"rgba(0,0,0,0.85)"}
          sx={{
            display: {
              xs: "none",
              md: "block",
              padding: "2rem",
            },
          }}
        >
          <Profile user={user} />
        </Grid>
      </Grid>
    </div>
  );
};

export default AppLayout;
