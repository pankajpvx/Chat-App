import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import RenderAttachment from "../../components/common/RenderAttachment";
import Table from "../../components/common/Table";
import AdminLayout from "../../components/layout/AdminLayout";
import { useError } from "../../hooks/useError";
import { useAllMessagesQuery } from "../../redux/api/adminApi";
import { fileFormat, transformImage } from "../../utils/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => {
      const { attachments } = params.row;

      if (attachments.length > 0) {
        return attachments.map((i) => {
          const url = i.url;
          const file = fileFormat(url);
          return (
            <Box
              key={url}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        });
      } else return "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 300,
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} sx={{ gap: "1rem" }}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  const [rows, setRows] = useState([]);
  const { data, isError, error, isLoading } = useAllMessagesQuery();

  useError([{ error, isError }]);

  useEffect(() => {
    if (!isError && data?.messages?.length > 0) {
      setRows(
        data.messages.map((i) => {
          return {
            ...i,
            id: i._id,
            sender: {
              name: i.sender.name,
              avatar: transformImage(i.sender.avatar, 50),
              createdAt: moment(i.createdAt).format("MMMM Do YYYY"),
            },
          };
        })
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {isLoading ? (
        <Skeleton
          variant="rectangular"
          animation={"wave"}
          width={"100%"}
          height={"100%"}
        />
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
