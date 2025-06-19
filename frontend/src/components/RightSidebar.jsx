import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import axios from "axios";
import { USER_API_URL } from "@/config/config";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

const RightSidebar = () => {
  const { user } = useSelector((state) => state.auth);
  const [suggestions, setSuggestions] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await axios.get(`${USER_API_URL}/getUserSuggestion`, {
          withCredentials: true,
        });
        setSuggestions(data.user);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    };

    fetchSuggestions();
  }, []);

  let isFollowing = (userId) => {
    return user?.followings.includes(userId);
  };

  const handleFollowUnfollow = async (friendId) => {
    try {
      const response = await axios.post(
        `${USER_API_URL}/followUnfollow/${friendId}`,
        null,
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
      // Update userProfile state safely
      isFollowing = !isFollowing;

      // Optional: Update auth user too, if relevant
      dispatch(
        setAuthUser({
          ...user,
          followings: user.followings?.includes(friendId)
            ? user.followings.filter((id) => id !== friendId)
            : [...user.followings, friendId],
        })
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "error");
      console.log(error);
    }
  };

  return (
    <div className="w-80 p-4 hidden lg:block">
      {/* Current user */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={"/profile"} >
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>
              <User />
            </AvatarFallback>
          </Avatar>
          </Link>
          <div>
            <Link to={"/profile"} >
            <p className="text-lg font-bold text-gray-900 dark:text-gray-200">
              {user?.username}
            </p>
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400">You</p>
          </div>
        </div>
        <Button
          variant="link"
          className="text-sm text-pink-600 px-0 h-auto hover:underline"
        >
          Switch
        </Button>
      </div>

      {/* Suggestions */}
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
          Suggestions for you
        </p>
        <Button
          variant="link"
          className="text-xs text-gray-600 dark:text-gray-400 px-0 h-auto hover:underline"
        >
          See All
        </Button>
      </div>

      <div className="space-y-4">
        {suggestions?.map((suggestion) => (
          <div
            key={suggestion._id}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Link to={`/profile/${suggestion?._id}`}>
              <Avatar className="h-8 w-8">
                <AvatarImage src={suggestion.avatar} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${suggestion?._id}`}>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                  {suggestion.username}
                </p>
                </Link>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Suggested for you
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              className={`text-sm px-0 h-auto font-semibold ${
                isFollowing(suggestion._id)
                  ? "text-gray-500 hover:text-gray-700"
                  : "text-pink-600 hover:text-pink-700"
              }`}
              onClick={() => handleFollowUnfollow(suggestion._id)}
            >
              {isFollowing(suggestion._id) ? "Following" : "Follow"}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSidebar;
