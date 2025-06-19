import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  MoreVertical,
  Smile,
  User,
} from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { useGetAllPosts } from "@/hooks/useGetAllPosts";
import axios from "axios";
import { POST_API_URL, USER_API_URL } from "@/config/config";
import { setPosts } from "@/redux/postSlice";
import { toast } from "sonner";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Link } from "react-router-dom";
import { setAuthUser } from "@/redux/authSlice";

const Feed = () => {
  useGetAllPosts();
  const { post, isLoading, error } = useSelector((store) => store.post);

  const { user } = useSelector((store) => store.auth);
  const [commentInputs, setCommentInputs] = useState({});
  const [dialogCommentInputs, setDialogCommentInputs] = useState({});

  const dispatch = useDispatch();

  let isFollowing = (postUser) => {
    return user?.followings.includes(postUser);
  };

  let isBookmarked = (postId) => {
    return user?.bookmarks?.some((b) => b._id === postId)
};


  const isYou = (postUser) => {
    return user?._id === postUser;
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs({ ...commentInputs, [postId]: value });
  };

  const handleDialogCommentChange = (postId, value) => {
    setDialogCommentInputs({ ...dialogCommentInputs, [postId]: value });
  };

  const handledeletePost = async (postId) => {
    try {
      const response = await axios.delete(`${POST_API_URL}/delete/${postId}`, {
        withCredentials: true,
      });
      const updatedPost = post.filter((post) => post?._id !== postId);
      dispatch(setPosts(updatedPost));
      toast.success("post deleted successfully");
    } catch (error) {
      console.log(error);
      toast.error("unable to delete post");
    }
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await axios.post(
        `${POST_API_URL}/${postId}/like`,
        null,
        {
          withCredentials: true,
        }
      );
      const updatedpost = post.map((post) =>
        post._id === postId && !post.likes.includes(user._id)
          ? { ...post, likes: [...post.likes, user._id] }
          : post
      );
      dispatch(setPosts(updatedpost));
      toast.success("post liked successfully");
    } catch (error) {
      console.log(error);
      toast.error("unable to like post");
    }
  };

  const handleDislikePost = async (postId) => {
    try {
      const response = await axios.post(
        `${POST_API_URL}/${postId}/dislike`,
        null,
        {
          withCredentials: true,
        }
      );
      const updatedPost = post.map((post) =>
        post._id === postId
          ? { ...post, likes: post.likes.filter((id) => id !== user._id) }
          : post
      );
      dispatch(setPosts(updatedPost));
      toast.success("post disliked");
    } catch (error) {
      console.log(error);
      toast.error("unable to dislike post");
    }
  };

  const handleComment = async (postId, type) => {
    try {
      const text =
        type === "bahar"
          ? commentInputs[postId]?.trim()
          : dialogCommentInputs[postId]?.trim();

      if (!text) {
        toast.error("Comment cannot be empty");
        return;
      }

      // Add the comment
      await axios.post(
        `${POST_API_URL}/addComments/${postId}`,
        { text },
        { withCredentials: true }
      );

      const { data } = await axios.get(
        `${POST_API_URL}/getComments/${postId}`,
        { withCredentials: true }
      );
      const updatedPost = post.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: data.comments,
            }
          : post
      );

      // Clear inputs
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
      setDialogCommentInputs((prev) => ({ ...prev, [postId]: "" }));

      // Update post with new comments
      dispatch(setPosts(updatedPost));

      toast.success("Comment added");
    } catch (error) {
      console.error(error);
      toast.error("Unable to add comment");
    }
  };

  const handleFollowUnfollow = async (friendId) => {
    try {
      const response = await axios.post(
        `${USER_API_URL}/followUnfollow/${friendId}`,
        null,
        { withCredentials: true }
      );
      toast.success(response?.data?.message);

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

  const handelBookmarks = async (post) => {
    try {
      const response = await axios.post(
        `${POST_API_URL}/bookmark/${post._id}`,
        null,
        { withCredentials: true }
      );
      toast.success(response?.data?.message);
      
      // Optional: Update auth user too, if relevant
      const isAlreadyBookmarked = () => {
        return user?.bookmarks?.some(
          (b) => b._id?.toString() === post._id?.toString()
        );
      };

      dispatch(
        setAuthUser({
          ...user,
          bookmarks: isAlreadyBookmarked()
            ? user.bookmarks.filter((b) => b._id?.toString() !== post._id?.toString())
            : [...user.bookmarks, {...post}],
        })
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "error");
      console.log(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {post?.map((post) => (
        <div
          key={post?._id}
          className="bg-white dark:bg-gray-900 rounded-lg shadow p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Link to={`/profile/${post?.auther?._id}`}>
                <Avatar>
                  <AvatarImage src={post.auther?.avatar} />
                  <AvatarFallback>
                    <User />
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div>
                <Link to={`/profile/${post?.auther?._id}`}>
                  <span className="font-semibold text-gray-800 dark:text-gray-200 block">
                    {post?.auther?.username}
                  </span>
                </Link>
              </div>

              <div>
                {isYou(post?.auther?._id) ? (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Author
                  </span>
                ) : isFollowing(post?.auther?._id) ? (
                  <button
                    onClick={() => handleFollowUnfollow(post?.auther?._id)}
                    className="text-sm text-gray-500 dark:text-gray-400"
                  >
                    Following
                  </button>
                ) : (
                  <Button
                    variant="link"
                    className="text-xs text-pink-500 p-0 h-auto"
                    onClick={() => handleFollowUnfollow(post?.auther?._id)}
                  >
                    Follow
                  </Button>
                )}
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-64 bg-white dark:bg-gray-900 rounded-xl shadow-xl p-4 space-y-3 border dark:border-gray-700">
                <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                  Post Options
                </h4>
                <div className="flex flex-col gap-2">
                  {post?.auther?.username === user?.username && (
                    <Button
                      variant="secondary"
                      className="w-full text-left text-sm"
                      onClick={() => {
                        handledeletePost(post?._id);
                      }}
                    >
                      Delete Post
                    </Button>
                  )}
                  {isYou(post?.auther?._id) ? (
                    ""
                  ) : isFollowing(post?.auther?._id) ? (
                    <Button
                      variant="outline"
                      className="w-full text-left text-sm"
                      onClick={() => handleFollowUnfollow(post?.auther?._id)}
                    >
                      Unfollow
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      className="w-full text-left text-sm"
                      onClick={() => handleFollowUnfollow(post?.auther?._id)}
                    >
                      Follow
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full text-left text-sm"
                  >
                    Report
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="rounded-lg overflow-hidden">
            <img src={post.image} alt="Post" className="w-full object-cover" />
          </div>

          <div className="flex gap-4 mt-4 text-gray-700 dark:text-gray-300">
            {post.likes.includes(user?._id) ? (
              <button
                onClick={() => {
                  handleDislikePost(post?._id);
                }}
              >
                <Heart className="text-pink-500 cursor-pointer text-pink5 fill-pink-500" />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLikePost(post?._id);
                }}
              >
                <Heart className="hover:text-pink-500 cursor-pointer text-pink5" />
              </button>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <MessageCircle className="hover:text-pink-500 cursor-pointer" />
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white dark:bg-gray-900 p-4 rounded-xl space-y-3">
                <DialogTitle></DialogTitle>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  Comments
                </h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {post.comments.map((c) => (
                    <div
                      key={c?._id}
                      className="flex items-center gap-3 border rounded-3xl"
                    >
                      <Link to={`/profile/${c?.auther?._id}`}>
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={c.auther.avatar} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <Link to={`/profile/${c?.auther?._id}`}>
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                              {c?.auther?.username}
                            </span>{" "}
                          </Link>
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t pt-3 flex items-center gap-2 border-gray-200 dark:border-gray-700">
                  <Smile className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    value={dialogCommentInputs[post?._id] || ""}
                    onChange={(e) =>
                      handleDialogCommentChange(post?._id, e.target.value)
                    }
                  />
                  {dialogCommentInputs[post?._id]?.trim() && (
                    <button
                      onClick={() => {
                        handleComment(post?._id, "andar");
                      }}
                      className="text-sm font-medium text-pink-600 hover:text-pink-700"
                    >
                      Post
                    </button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
            <Share2 className="hover:text-pink-500 cursor-pointer" />
            {isBookmarked(post?._id) ? (
              <Bookmark className="fill-black cursor-pointer ml-auto" onClick={() => handelBookmarks(post)}/>
            ) : (
              <Bookmark className="hover:text-pink-500 cursor-pointer ml-auto" onClick={() => handelBookmarks(post)}/>
            )}
          </div>

          {post.likes && (
            <p className="mt-2 text-sm font-medium text-gray-800 dark:text-gray-200">
              {post.likes?.length} {post.likes?.length === 1 ? "like" : "likes"}
            </p>
          )}

          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
            <Link to={`/profile/${post?.auther?._id}`}>
              <span className="font-semibold mr-1">{post.auther.username}</span>
            </Link>
            {post.caption}
          </p>

          {post.comments?.length > 0 && (
            <Dialog>
              <DialogTrigger asChild>
                <button className="text-sm text-gray-500 hover:underline dark:text-gray-400 mt-2">
                  View all {post.comments?.length} comments
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white dark:bg-gray-900 p-4 rounded-xl space-y-3">
                <DialogTitle></DialogTitle>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                  Comments
                </h3>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {post.comments.map((c) => (
                    <div
                      key={c?._id}
                      className="flex items-center gap-3 border rounded-3xl"
                    >
                      <Link to={`/profile/${c?.auther?._id}`}>
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={c.auther.avatar} />
                          <AvatarFallback>
                            <User />
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          <Link to={`/profile/${c?.auther?._id}`}>
                            <span className="font-medium text-gray-800 dark:text-gray-100">
                              {c?.auther?.username}
                            </span>{" "}
                          </Link>{" "}
                          {c.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 border-t pt-3 flex items-center gap-2 border-gray-200 dark:border-gray-700">
                  <Smile className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    value={dialogCommentInputs[post._id] || ""}
                    onChange={(e) =>
                      handleDialogCommentChange(post._id, e.target.value)
                    }
                  />
                  {dialogCommentInputs[post._id]?.trim() && (
                    <button
                      onClick={() => {
                        handleComment(post._id, "andar");
                      }}
                      className="text-sm font-medium text-pink-600 hover:text-pink-700"
                    >
                      Post
                    </button>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          )}

          <div className="mt-3 border-t border-gray-200 dark:border-gray-700 pt-2 flex items-center gap-2">
            <Smile className="text-gray-400" />
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent outline-none text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400"
              value={commentInputs[post._id] || ""}
              onChange={(e) => handleCommentChange(post._id, e.target.value)}
            />
            {commentInputs[post._id]?.trim() && (
              <button
                onClick={() => {
                  handleComment(post._id, "bahar");
                }}
                className="text-sm font-medium text-pink-600 hover:text-pink-700"
              >
                Post
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
