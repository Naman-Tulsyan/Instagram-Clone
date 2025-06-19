import React, { useState } from "react";
import {
  Home,
  Search,
  PlusSquare,
  Heart,
  User,
  LogOut,
  Compass,
  MessageCircle,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import { USER_API_URL } from "@/config/config";
import { toast } from "sonner";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import store from "../redux/store.js";
import { setAuthUser } from "@/redux/authSlice.js";

const SideBar = () => {
  const { user } = useSelector((store) => store.auth);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const avatar = user?.avatar || "";

  const { likeNotification } = useSelector((store) => store.rtn);
  const notificationCount = likeNotification?.length || 0;
  console.log(notificationCount);

  const navItems = [
    { icon: <Home />, label: "Home", path: "/" },
    { icon: <Search />, label: "Search", path: "/search" },
    { icon: <Compass />, label: "Explore", path: "/expore" },
    { icon: <MessageCircle />, label: "Messages", path: "/messages" },
    { icon: <PlusSquare />, label: "Create", path: "/create" },
    {
      icon: <Heart />,
      label: "Activity",
      path: "/activity",
      badge: notificationCount > 0 ? notificationCount : null,
    },
    {
      icon: (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatar} alt="Profile" />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
        </div>
      ),
      label: "Profile",
      path: "/profile",
    },
  ];

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.get(`${USER_API_URL}/logout`, {
        withCredentials: true,
      });
      toast.success(response?.data?.message || "Logout successfull");
      dispatch(setAuthUser(null));
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside className="h-screen w-20 md:w-70 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-pink-600 dark:text-pink-400 hidden md:block">
          Instagram
        </h1>
        <nav className="flex flex-col gap-4">
          {navItems.map((item, index) => (
            <NavLink
              to={item.path}
              key={index}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 text-xl ${
                  isActive
                    ? "text-pink-600 dark:text-pink-400 font-semibold"
                    : "text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400"
                }`
              }
            >
              <span className="relative">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </span>
              <span className="hidden md:inline text-xl">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogOut />
        <span className="hidden md:inline text-base">
          {isLoading ? "Logging Out" : "Logout"}
        </span>
      </button>
    </aside>
  );
};

export default SideBar;
