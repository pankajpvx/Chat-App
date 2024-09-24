import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import UserItem from "./common/UserItem";
import { useDispatch } from "react-redux";
import { setIsNewGroup } from "../redux/reducers/misc";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../redux/api/api";
import { useError } from "../hooks/useError";
import toast from "react-hot-toast";
import { useAsyncMutation } from "../hooks/hooks";

function NewGroups({ isNewGroup }) {
  const [selectedMembers, setSelectedMembers] = useState([]);
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useAvailableFriendsQuery({});
  const [executeMutation] = useAsyncMutation(useNewGroupMutation);

  useError([{ isError, error }]);

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  const groupName = useInputValidation("");

  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  const submitHandler = async () => {
    if (!groupName.value) return toast.error("Group name is required");
    if (selectedMembers.length < 2)
      return toast.error("Please select atleast 3 members");
    await executeMutation(`Creating ${groupName.value}`, {
      name: groupName.value,
      members: selectedMembers,
    });
    closeHandler();
  };

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography typography={"body1"}>Menbers</Typography>

        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          )}
        </Stack>

        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button variant="text" color="error" onClick={closeHandler}>
            Cancel
          </Button>
          <Button variant="contained" onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
}

export default NewGroups;
