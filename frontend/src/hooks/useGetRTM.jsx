import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMessage } from "@/redux/chatSlice";

export const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio);
  const { selectedConversation } = useSelector((store) => store.chat);

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    const handleNewMessage = (createdMessage) => {
      if (createdMessage.receiverId === selectedConversation._id || createdMessage.senderId === selectedConversation._id) {
        dispatch(setMessage((prevMessages) => [...prevMessages, createdMessage]));
      }
    };

    socket.on("newMsg", handleNewMessage);

    return () => {
      socket.off("newMsg", handleNewMessage);
    };
  }, [socket, selectedConversation?._id, dispatch]);
};
