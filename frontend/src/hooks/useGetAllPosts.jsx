import { POST_API_URL } from "@/config/config";
import { setPostErr, setPostIsLoading, setPosts } from "@/redux/postSlice";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useGetAllPosts = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        dispatch(setPostIsLoading(true));
        const response = await axios.get(`${POST_API_URL}/getAll`, {
          withCredentials: true,
        });
        dispatch(setPosts(response.data.posts));
      } catch (error) {
        dispatch(setPostErr(error));
        console.log(error);
      } finally {
        dispatch(setPostIsLoading(false));
      }
    };
    fetchAllPost();
  }, []);
};
