import React, { useEffect, useRef, useState } from "react";
import { User, ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MESSAGE_API_URL, USER_API_URL } from "@/config/config";
import axios from "axios";
import store from "@/redux/store";
import { toast } from "sonner";
import { setMessage, setSelectedConversation } from "@/redux/chatSlice";
import { useGetAllMessage } from "@/hooks/useGetAllMessage";
import { useGetRTM } from "@/hooks/useGetRTM";

const ChatPage = () => {
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const { user } = useSelector((store) => store.auth);
  const { onlineUser, messages, selectedConversation } = useSelector(
    (store) => store.chat
  );

  useGetRTM();

  const fetchMessages = useGetAllMessage();
  useEffect(() => {
  if (selectedConversation?._id) {
    fetchMessages();
  }
}, [selectedConversation]); // <-- dependency is key!


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

  useEffect(() => {
    messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (friendId) => {
    if (!newMsg.trim() || !friendId) return;

    try {
      const response = await axios.post(
        `${MESSAGE_API_URL}/send/${friendId}`,
        { message: newMsg },
        { withCredentials: true }
      );

dispatch(setMessage((prev) => [...prev, response.data.text]));
      setNewMsg("");
    } catch (error) {
      toast.error("Unable to send message");
      console.error(error);
    }
  };

  const handleBack = () => {
    dispatch(setSelectedConversation(null));
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow relative">
      {/* Sidebar */}
      <div
        className={`${
          selectedConversation ? "hidden md:block" : "block"
        } w-full md:w-1/3 border-r dark:border-gray-700 overflow-y-auto`}
      >
        <div className="p-4 text-lg font-semibold dark:text-white border-b">
          Messages
        </div>
        {suggestions?.map((conv) => (
          <div
            key={conv?._id}
            onClick={() => {
              dispatch(setSelectedConversation(conv));
            }}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors border-b ${
              selectedConversation?._id === conv?._id
                ? "bg-gray-200 dark:bg-gray-800"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }`}
          >
            <Avatar>
              <AvatarImage src={conv.avatar} />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="font-medium text-gray-900 dark:text-white">
                {conv.username}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 truncate w-40">
                {onlineUser.includes(conv?._id) ? (
                  <span className="text-green-500">online</span>
                ) : (
                  <span className="text-red-500">offline</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div
        className={`flex-1 flex flex-col h-full w-full relative ${
          selectedConversation ? "block" : "hidden"
        } md:block`}
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b dark:border-gray-700 flex items-center gap-3">
              {/* Mobile back button */}
              <button
                onClick={handleBack}
                className="md:hidden text-gray-600 dark:text-gray-300"
              >
                <ArrowLeft />
              </button>
              <Link to={`/profile/${selectedConversation?._id}`}>
                <Avatar>
                  <AvatarImage src={selectedConversation.avatar} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${selectedConversation?._id}`}>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {selectedConversation.username}
                  </p>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50 dark:bg-gray-800">
              {messages?.map((msg) => {
                const isMine = msg?.senderId === user?._id;
                return (
                  <div
                    key={msg._id}
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm break-words ${
                      isMine
                        ? "ml-auto bg-pink-500 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                    }`}
                  >
                    {msg?.message}
                  </div>
                );
              })}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t dark:border-gray-700 flex gap-2 bg-white dark:bg-gray-900 absolute bottom-0 left-0 right-0">
              <Input
                placeholder="Type your message..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && selectedConversation?._id) {
                    handleSendMessage(selectedConversation._id);
                  }
                }}
              />
              <Button
                onClick={() => handleSendMessage(selectedConversation?._id)}
                disabled={!newMsg.trim()}
              >
                Send
              </Button>
            </div>
          </>
        ) : (
          <div className="hidden h-screen md:flex flex-1 items-center justify-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
