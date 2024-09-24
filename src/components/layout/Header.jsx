import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense } from "react";
import { mainBgColor } from "../../constants/colors";
import {
  Notifications as NotificationIcon,
  Group as GroupIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import SearchDialog from "../searchDialog";
import Notification from "../Notification";
import NewGroups from "../NewGroups";
import axios from "axios";
import toast from "react-hot-toast";
import { server } from "../../constants/config";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsMobile,
  setIsSearch,
  setIsNotification,
  setIsNewGroup,
} from "../../redux/reducers/misc";
import { resestNotificationCount } from "../../redux/reducers/chat";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNottification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);

  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };
  const openSearchDialog = () => {
    dispatch(setIsSearch(!isSearch));
  };
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };
  const navigateToGroup = () => {
    navigate("/groups");
  };

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resestNotificationCount());
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      window.location.reload();

      toast.success(data.message);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            backgroundImage: mainBgColor,
          }}
        >
          <Toolbar>
            <Typography
              onClick={() => navigate("/")}
              variant="h6"
              sx={{
                cursor: "pointer",
                display: { xs: "none", sm: "block" },
              }}
            >
              Chat App
            </Typography>

            <Box
              variant="h6"
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />

            <Box>
              <IconBtn
                title="Search"
                handler={openSearchDialog}
                icon={<SearchIcon />}
              />

              <IconBtn
                title="New Group"
                handler={openNewGroup}
                icon={<AddIcon />}
              />

              <IconBtn
                title="Manage Groups"
                handler={navigateToGroup}
                icon={<GroupIcon />}
              />
              <IconBtn
                title="Notifications"
                value={notificationCount}
                handler={openNotification}
                icon={<NotificationIcon />}
              />

              <IconBtn
                title="Logout"
                handler={logoutHandler}
                icon={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop />}>
          <SearchDialog isSearch={isSearch} closeModal={openSearchDialog} />
        </Suspense>
      )}
      {isNottification && (
        <Suspense fallback={<Backdrop />}>
          <Notification
            isNottification={isNottification}
            closeModel={() => dispatch(setIsNotification(false))}
          />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop />}>
          <NewGroups isNewGroup={isNewGroup} />
        </Suspense>
      )}
    </>
  );
}

function IconBtn({ title, icon, handler, value }) {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={handler}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
}

export default Header;
