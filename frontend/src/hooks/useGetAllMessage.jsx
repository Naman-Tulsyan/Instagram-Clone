import { MESSAGE_API_URL } from "@/config/config";
import { setMessage } from "@/redux/chatSlice";
import store from "@/redux/store";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export const useGetAllMessage = () => {
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((store) => store.chat);
  const fetchMessages = async () => {
    try {
      if (!selectedConversation?._id) {
        return;
      }
      const response = await axios.post(
        `${MESSAGE_API_URL}/getAll/${selectedConversation?._id}`,
        null,
        {
          withCredentials: true,
        }
      );
      dispatch(setMessage(response.data.messages));
    } catch (error) {
      console.log(error);
    }
  };
  return fetchMessages;
};
