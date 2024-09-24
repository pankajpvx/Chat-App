import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import UserItem from "../common/UserItem";
import { useDispatch } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";
import {
  useAddMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useAsyncMutation } from "../../hooks/hooks";
import { useError } from "../../hooks/useError";

const AddMembersDialog = ({ isOpen, chatId }) => {
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [addMembers, _, isLoadingAddMembers] = useAsyncMutation(
    useAddMembersMutation
  );
  const availableFriends = useAvailableFriendsQuery({ chatId });
  const friends = availableFriends?.data?.friends || [];

  useError([
    { error: availableFriends.error, isError: availableFriends.isError },
  ]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding new members...", { chatId, members: selectedMembers });
    closeHandler();
  };

  return (
    <Dialog open={isOpen} onClose={closeHandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle>Add Member</DialogTitle>
        <Stack>
          {friends.length > 0 ? (
            friends.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends</Typography>
          )}
        </Stack>

        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isLoadingAddMembers}
            onClick={addMemberSubmitHandler}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMembersDialog;
