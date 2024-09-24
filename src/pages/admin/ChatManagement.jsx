import { Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AvatarIcon from "../../components/common/AvatarIcon";
import Table from "../../components/common/Table";
import AdminLayout from "../../components/layout/AdminLayout";
import { useError } from "../../hooks/useError";
import { useAllChatsQuery } from "../../redux/api/adminApi";
import { transformImage } from "../../utils/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 250,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => {
      if (params.row.avatar) {
        return <AvatarIcon avatar={params.row.avatar} />;
      }
      return null;
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "totalMembers",
    headerName: "total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarIcon max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => {
      return (
        <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
          {params.row.creator.avatar ? (
            <AvatarIcon avatar={params.row.creator.avatar} />
          ) : null}
          <span>{params.row.creator.name}</span>
        </Stack>
      );
    },
  },
];
const ChatManagement = () => {
  const [rows, setRows] = useState([]);
  const { data, isError, error, isLoading } = useAllChatsQuery();

  useError([{ error, isError }]);

  useEffect(() => {
    if (!isError && data?.chats?.length > 0)
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members
            .slice(0.3)
            .map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: [transformImage(i.creator.avatar)],
          },
        }))
      );
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
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
