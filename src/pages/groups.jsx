import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import GroupList from "../components/groupChat/GroupList";
import ConfirmDeleteModal from "../components/dialogs/ConfirmDeleteModal";
import AddMembersDialog from "../components/dialogs/AddMembersDialog";
import UserItem from "../components/common/UserItem";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useGetMyGroupsQuery,
  useRemoveMembersMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { useError } from "../hooks/useError";
import LayoutLoader from "../components/layout/LayoutLoader";
import { useAsyncMutation } from "../hooks/hooks";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../redux/reducers/misc";

function Groups() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState();
  const chatId = useSearchParams()[0].get("group");
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [groupNameUpdatedVal, setGroupNameUpdatedVal] = useState();
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const { isAddMember } = useSelector((state) => state.misc);
  const groupLists = useGetMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  const [udateGroupName] = useAsyncMutation(useRenameGroupMutation);
  const [removeMembers, _, removeMemberLoader] = useAsyncMutation(
    useRemoveMembersMutation
  );
  const [deleteGroup] = useAsyncMutation(useDeleteChatMutation);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setGroupNameUpdatedVal(groupData.chat.name);
      setMembers(groupData.chat.members);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdatedVal("");
      setMembers([]);
    };
  }, [groupDetails.data]);

  useError([
    { isError: groupLists.isError, error: groupLists.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ]);

  const navigateBack = () => {
    navigate("/");
  };

  const handleMobile = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false);
  };

  const updateGroupName = () => {
    setIsEdit(false);
    udateGroupName("Updating group name...", {
      name: groupNameUpdatedVal,
      chatId,
    });
  };

  const removeMemberHandler = (userId) => {
    removeMembers("Removing member...", { chatId, userId });
  };

  const GroupName = (
    <Stack
      direction={"row"}
      alignItems={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdatedVal}
            onChange={(e) => setGroupNameUpdatedVal(e.target.value)}
          />
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const IconBtn = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <IconButton onClick={handleMobile}>
          <MenuIcon />
        </IconButton>
      </Box>

      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            color: "white",
            bgcolor: "rgba(0,0,0,0.8)",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspace />
        </IconButton>
      </Tooltip>
    </>
  );

  const openAddGroupMembers = () => {
    dispatch(setIsAddMember(true));
  };

  const confirmDeleteHandler = () => {
    setConfirmDeleteDialog(true);
  };

  const closeConfirmDeleteHandler = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    deleteGroup("Deleting group...", chatId);
    closeConfirmDeleteHandler();
    navigate("/groups");
  };

  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      marginTop={"2rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        variant="text"
        onClick={confirmDeleteHandler}
        startIcon={<DeleteIcon />}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddGroupMembers}
      >
        Add Members
      </Button>
    </Stack>
  );

  return groupLists.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container>
      <Grid
        item
        sx={{
          display: {
            xs: "none",
            sm: "block",
          },
        }}
        sm={4}
      >
        <GroupList myGroups={groupLists.data.groups} chatId={chatId} />
      </Grid>

      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "0rem 3rem",
        }}
      >
        {IconBtn}
        {groupName && (
          <>
            {GroupName}
            <Typography
              style={{
                marginBottom: "0.3rem",
                marginInline: "1rem",
              }}
              alignSelf={"flex-start"}
              variant="h6"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"1rem"}
              height={"43vh"}
              overflow={"auto"}
            >
              {removeMemberLoader ? (
                <CircularProgress />
              ) : (
                members.map((i) => (
                  <UserItem
                    user={i}
                    key={i._id}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "0.4rem 2rem",
                      borderRadius: "0.5rem",
                    }}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && <AddMembersDialog isOpen={isAddMember} chatId={chatId} />}

      {confirmDeleteDialog && (
        <ConfirmDeleteModal
          open={confirmDeleteDialog}
          handleClose={closeConfirmDeleteHandler}
          deleteHandler={deleteHandler}
        />
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenuOpen}
        onClose={handleMobileClose}
      >
        <GroupList w="50vw" myGroups={groupLists.data.groups} chatId={chatId} />
      </Drawer>
    </Grid>
  );
}

export default Groups;
