import axios from "axios";
import React, { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { server } from "./constants/config";
import AdminLogin from "./pages/admin/AdminLogin";
import ChatManagement from "./pages/admin/ChatManagement";
import Dashboard from "./pages/admin/Dashboard";
import MessageManagement from "./pages/admin/MessageManagement";
import UserManagement from "./pages/admin/UserManagement";
import { userExists, userNotExists } from "./redux/reducers/auth";
import { SocketProvider } from "./socket";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { Skeleton } from "@mui/material";
import NotFound from "./components/NotFound";

const Home = lazy(() => import("./pages/home"));
const Login = lazy(() => import("./pages/login"));
const Chat = lazy(() => import("./pages/chat"));
const Groups = lazy(() => import("./pages/groups"));

function App() {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch((err) => dispatch(userNotExists()));
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      id: "root",
      element: (
        <SocketProvider>
          <ProtectedRoute user={user} />
        </SocketProvider>
      ),
      errorElement: <NotFound />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/chat/:chatId",
          element: <Chat />,
        },
        {
          path: "/groups",
          element: <Groups />,
        },
      ],
    },
    {
      path: "/login",
      element: (
        <ProtectedRoute user={!user} redirect="/">
          <Login />
        </ProtectedRoute>
      ),
    },
    {
      path: "/admin",
      element: <AdminLogin />,
    },
    {
      path: "/admin/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/admin/users",
      element: <UserManagement />,
    },
    {
      path: "/admin/chats",
      element: <ChatManagement />,
    },
    {
      path: "/admin/messages",
      element: <MessageManagement />,
    },
  ]);

  <Skeleton
    variant="rectangular"
    animation={"wave"}
    width={"100%"}
    height={"100vh"}
  />;
  return loader ? (
    <Skeleton variant="rectangle" height={"100vh"} />
  ) : (
    <Suspense fallback={<Skeleton variant="rectangle" height={"100vh"} />}>
      <RouterProvider router={router} />
      <Toaster position="top-center" />
    </Suspense>
  );
}

export default App;
