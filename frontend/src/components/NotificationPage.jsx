import React from "react";
import { useSelector } from "react-redux";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const { likeNotification } = useSelector((state) => state.rtn);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
        Notifications
      </h2>

      {likeNotification?.length === 0 ? (
        <div className="text-gray-500 dark:text-gray-400">No notifications yet.</div>
      ) : (
        <ul className="space-y-4">
          {likeNotification.map((notification, index) => (
            <li
              key={index}
              className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow"
            >
              <Avatar>
                <AvatarImage src={notification.user.avatar} alt="user" />
                <AvatarFallback><User /></AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">
                  {notification.user.username}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  {notification.message}
                </p>
              </div>

              {notification.type === "like" ? (
                <ThumbsUp className="text-green-500" />
              ) : (
                <ThumbsDown className="text-red-500" />
              )}

            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
