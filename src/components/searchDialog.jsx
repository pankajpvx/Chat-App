import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";

import { Search as SearchIcon } from "@mui/icons-material";
import React, { useEffect } from "react";
import { useInputValidation } from "6pp";
import UserItem from "./common/UserItem";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../redux/api/api";
import { useAsyncMutation } from "../hooks/hooks";

function SearchDialog({ isSearch, closeModal }) {
  const [users, setUsers] = React.useState([]);
  const [searchUser] = useLazySearchUserQuery();
  const search = useInputValidation("");
  const [sendFriendRequest, data, isLoading] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const addFriendHandler = async (id) => {
    await sendFriendRequest("sending friend request", { userId: id });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then((res) => setUsers(res.data.users))
        .catch((err) => console.log(err));
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={closeModal}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          // label="Search"
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        ></TextField>
      </Stack>

      <List>
        {users?.map((user) => (
          <UserItem
            user={user}
            key={user._id}
            handler={addFriendHandler}
            handlerIsLoading={isLoading}
          />
        ))}
      </List>
    </Dialog>
  );
}

export default SearchDialog;
