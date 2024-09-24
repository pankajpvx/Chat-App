import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/common/Table";
import { Avatar, Skeleton } from "@mui/material";
import { useAllUsersQuery } from "../../redux/api/adminApi";
import { useError } from "../../hooks/useError";

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
        return <Avatar alt={params.row.name} src={params.row.avatar} />;
      }
      return null;
    },
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 150,
  },
];
const UserManagement = () => {
  const { data, error, isError, isLoading } = useAllUsersQuery();
  useError([{ error, isError }]);

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
          heading={"All Users"}
          columns={columns}
          rows={data?.users || []}
        />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
