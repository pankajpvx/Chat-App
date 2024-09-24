import { ListItemText, Menu, MenuItem, MenuList, Tooltip } from "@mui/material";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsfileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  AudioFile as AudioFileIcon,
  Image as ImageIcon,
  UploadFile as UploadFileIcon,
  VideoFile as VideoFileIcon,
} from "@mui/icons-material";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

function FileMenu({ anchorE1, chatId }) {
  const dispatch = useDispatch();
  const { isFileMenu, uploadingLoader } = useSelector((state) => state.misc);
  const [sendAttachments] = useSendAttachmentsMutation();
  const imageRef = useRef(null);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const fileRef = useRef(null);

  function onCloseHandler() {
    dispatch(setIsfileMenu(false));
  }

  const selectImageRef = () => imageRef.current.click();
  const selectAudioRef = () => audioRef.current.click();
  const selectVideoRef = () => videoRef.current.click();
  const selectFileeRef = () => fileRef.current.click();

  const fileChangeHandler = async (e, type) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;
    if (files.length > 5)
      return toast.error(`You can only send 5 ${type} at a time`);
    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${type}...`);
    onCloseHandler();
    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));

      const res = await sendAttachments(myForm);
      if (res.data) toast.success(`${type} sent successfully`, { id: toastId });
      else toast.error(`Failed to send ${type}`, { id: toastId });
    } catch (error) {
      toast.error(error, { id: toastId });
    } finally {
      dispatch(setUploadingLoader(false));
    }
  };

  return (
    <Menu
      anchorEl={anchorE1}
      open={isFileMenu}
      onClose={onCloseHandler}
      sx={{}}
    >
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={selectImageRef}>
            <Tooltip title="Image">
              <ImageIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Image </ListItemText>
            <input
              type="file"
              ref={imageRef}
              multiple
              accept="image/png, image/jpeg, image/gif"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "image")}
            />
          </MenuItem>

          <MenuItem onClick={selectAudioRef}>
            <Tooltip title="Audio">
              <AudioFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              ref={audioRef}
              multiple
              accept="audio/mpeg, audio/wav"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
            />
          </MenuItem>

          <MenuItem onClick={selectVideoRef}>
            <Tooltip title="Video">
              <VideoFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              ref={videoRef}
              multiple
              accept="video/mp4, video/webm, video/ogg"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
            />
          </MenuItem>

          <MenuItem onClick={selectFileeRef}>
            <Tooltip title="File">
              <UploadFileIcon />
            </Tooltip>
            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              ref={fileRef}
              multiple
              accept="*"
              style={{ display: "none" }}
              onChange={(e) => fileChangeHandler(e, "Files")}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
}

export default FileMenu;
