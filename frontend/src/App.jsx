import { createBrowserRouter } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { RouterProvider } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import Profile from "./components/Profile";
import CreatePost from "./components/CreatePost";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUser } from "./redux/chatSlice";
import { setLikeNotification} from "./redux/rtnSlice";
import NotificationPage from "./components/NotificationPage";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Layout /></ProtectedRoute>,
    children: [
      { path: "", element: <ProtectedRoute><Home /></ProtectedRoute> },
      { path: "profile/:userId", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "profile", element: <ProtectedRoute><Profile /></ProtectedRoute> },
      { path: "create", element: <ProtectedRoute><CreatePost /></ProtectedRoute> },
      { path: "messages", element: <ProtectedRoute><ChatPage /></ProtectedRoute> },
      { path: "activity", element: <ProtectedRoute><NotificationPage /></ProtectedRoute> },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    element: <div>Invalid Page </div>
  }
]);

function App() {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    let socketio;

    if (user) {
      socketio = io("http://localhost:8080", {
        query: { userId: user._id },
        transports: ["websocket"],
      });

      dispatch(setSocket(socketio));

      socketio.on("getOnlineUser", (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });

      socketio.on("notification", (notification) => {
        dispatch(setLikeNotification(notification, {userId : user._id}))
      })
    }

    return () => {
      if (socketio) {
        socketio.disconnect(); // use disconnect() instead of close()
        dispatch(setSocket(null));
      }
    };
  }, [user, dispatch]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
