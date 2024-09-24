import React from "react";
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../redux/api/api";
import { useError } from "../hooks/useError";
import toast from "react-hot-toast";

function Notification({ isNottification, closeModel }) {
  const { data, error, isError } = useGetNotificationsQuery();
  const [acceptRequest] = useAcceptFriendRequestMutation();

  useError([{ isError, error }]);

  const FriendRequestHandler = async ({ _id, accept }) => {
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res?.data.success) {
        toast.success(res.data.message);
      } else toast.error(res.data?.error || "something went wrong");
    } catch (e) {
      toast.error("something went wrong");
      console.log(e);
    }
  };

  return (
    <Dialog open={isNottification} onClose={closeModel}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notification </DialogTitle>
        {data?.allRequests?.length > 0 ? (
          data.allRequests.map((i) => (
            <NotificationItem
              sender={i.sender}
              _id={i._id}
              key={i._id}
              handler={FriendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
}

function NotificationItem({ sender, _id, handler }) {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={avatar} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            width: "100%",
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {`${name} has sent you friend request`}
        </Typography>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
}

export default Notification;
