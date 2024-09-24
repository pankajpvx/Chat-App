import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { IconButton, Stack } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { InputBox } from "../components/styled/VisuallyHeadenInput";
import { orange } from "../constants/colors";
import FileMenu from "../components/common/FileMenu";
import MessageComponent from "../components/common/messageComponent";
import { getSocket } from "../socket";
import { NEW_MESSAGE } from "../constants/events";
import { useNavigate, useParams } from "react-router-dom";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import LayoutLoader from "../components/layout/LayoutLoader";
import { useInfiniteScrollToTop, useSocketEvents } from "../hooks/hooks";
import { useError } from "../hooks/useError";
import { useDispatch } from "react-redux";
import { setIsfileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";

function Chat({ user, chatId }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = getSocket();
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const members = chatDetails?.data?.chat?.members;
  const containerRef = useRef(null);
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });
  const scrollRef = useRef();

  const {
    data: allData,
    setData,
    hasMore,
    setIsBottom,
  } = useInfiniteScrollToTop({
    oldMessagesChunk,
    page,
    setPage,
    containerRef,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessage("");
      setMessages([]);
      setData([]);
      setPage(1);
      setIsBottom(false);
    };
  }, [chatId]);

  useError([
    { error: chatDetails.error, isError: chatDetails.isError },
    { error: oldMessagesChunk.error, isError: oldMessagesChunk.isError },
  ]);

  useEffect(() => {
    if (
      chatDetails.isError &&
      chatDetails?.error?.data?.message === "Chat not found"
    ) {
      navigate("/");
    }
  }, [chatDetails.isError]);

  const newMessagesHandler = useCallback(
    (data) => {
      if (chatId === data.chatId) {
        setMessages((prev) => [...prev, data?.message]);
      }
    },
    [chatId]
  );

  const eventHandler = useMemo(
    () => ({ [NEW_MESSAGE]: newMessagesHandler }),
    [chatId]
  );

  useSocketEvents(socket, eventHandler);

  const submitHandler = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  const allMessages = [...(allData.length > 0 ? allData : []), ...messages];

  return (
    <>
      {chatDetails.isLoading ? (
        <LayoutLoader />
      ) : (
        <>
          <Stack
            ref={containerRef}
            className="container"
            boxSizing={"border-box"}
            padding={"1rem"}
            spacing={"1rem"}
            bgcolor={"#f4f4f4"}
            height={"90%"}
            sx={{
              overflowX: "hidden",
              overflowY: "auto",
            }}
          >
            {hasMore && <div style={{ visibility: "hidden" }}>Loading...</div>}
            {!oldMessagesChunk.isLoading &&
              allMessages.map((i, index) => (
                <MessageComponent key={i._id} message={i} user={user} />
              ))}

            <div ref={scrollRef} />
          </Stack>

          <form
            style={{
              height: "10%",
            }}
            onSubmit={submitHandler}
          >
            <Stack
              direction={"row"}
              height={"100%"}
              alignItems={"center"}
              padding={"0.3rem"}
              position={"relative"}
            >
              <IconButton
                sx={{
                  position: "absolute",
                  rotate: "30deg",
                }}
                onClick={(e) => {
                  dispatch(setIsfileMenu(true));
                  setFileMenuAnchor(e.currentTarget);
                }}
              >
                <AttachFileIcon />
              </IconButton>

              <InputBox
                placeholder="Type Message Here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

              <IconButton
                type="submit"
                sx={{
                  rotate: "-30deg",
                  backgroundColor: orange,
                  color: "white",
                  marginLeft: "1rem",
                  padding: "0.5rem",
                  "&:hover": {
                    bgcolor: "error.dark",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Stack>
          </form>
          <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
        </>
      )}
    </>
  );
}

export default AppLayout(Chat);
