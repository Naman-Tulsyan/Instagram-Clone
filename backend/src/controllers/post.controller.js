import { Comment } from "../models/comment.model.js";
import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import { getSocketId, io } from "../socket/socket.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const addPost = async (req, res) => {
  try {
    const { caption } = req.body;

    const auther = await User.findById(req.user._id);
    if (!auther) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const imageLocalPath = req.file?.path;
    const image = await uploadOnCloudinary(imageLocalPath);

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const post = await Post.create({
      caption: caption || "",
      image: image.url,
      auther: auther._id,
    });

    auther.posts.push(post._id);
    await auther.save();

    await post.populate({ path: "auther", select: "-password" });

    return res.status(200).json({
      success: true,
      message: "post created successfully",
      post,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "auther", select: "username avatar" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "auther", select: "username avatar" },
      });

    return res.status(200).json({
      success: true,
      message: "post fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserPost = async (req, res) => {
  try {
    const auther = req.user._id;
    if (!auther) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const posts = await Post.find({ auther })
      .sort({ createdAt: -1 })
      .populate({ path: "auther", select: "username avatar" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 },
        populate: { path: "auther", select: "username avatar" },
      });

    return res.status(200).json({
      success: true,
      message: "post fetched successfully",
      posts,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  try {
    const user = req.user?._id;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const postId = req.params?.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "invalid post Id",
      });
    }

    await Post.updateOne({ _id: postId }, { $addToSet: { likes: user } });

    // Implement Web Socket for real time notification
    const userr = {
      username : req.user?.username,
      avatar : req.user?.avatar
    } 
    const postOwner = post.auther.toString();
    if(postOwner !== user.toString()){
      const notification = {
        type: "like",
        userId: user,
        user: userr,
        postId,
        message: "Your post is liked"
      }

      const postOwnerSocketId = getSocketId(postOwner)
      io.to(postOwnerSocketId).emit('notification', notification)
    }

    return res.status(200).json({
      success: true,
      message: "post liked successfully",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const dislikePost = async (req, res) => {
  try {
    const user = req.user?._id;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const postId = req.params?.id;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "invalid post Id",
      });
    }

    await Post.updateOne({ _id: postId }, { $pull: { likes: user } });

    // Implement Web Socket for real time notification
    const userr = {
      username : req.user?.username,
      avatar : req.user?.avatar
    } 
    const postOwner = post.auther.toString();
    if(postOwner !== user.toString()){
      const notification = {
        type: "dislike",
        userId: user,
        user: userr,
        postId,
        message: "Your post is disliked",
        receiverId: postOwner,
      }

      const postOwnerSocketId = getSocketId(postOwner)
      io.to(postOwnerSocketId).emit('notification', notification)
    }

    return res.status(200).json({
      success: true,
      message: "post disliked successfully",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "comment is required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }

    const comment = await Comment.create({
      text,
      auther: userId,
      post: post._id,
    });

    await comment.populate({ path: "auther", select: "username, avatar" });

    post.comments.push(comment._id);
    await post.save();

    return res.status(200).json({
      success: true,
      message: "comment added successfully",
      comment,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getCommentsForPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) {
      return res.status(400).json({
        success: false,
        message: "post id is required",
      });
    }

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "auther",
        select: "username avatar",
      });

    if (!comments) {
      return res.status(404).json({
        success: false,
        message: "comments not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "comments fetched successfully",
      comments,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  try {
    const auther = req.user;
    if (!auther) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }

    if (auther._id.toString() !== post.auther.toString()) {
      return res.status(403).json({
        success: false,
        message: "unauthorised access",
      });
    }

    await Post.findByIdAndDelete(post._id);

    const user = await User.findById(auther._id);
    user.posts = user.posts.filter((id) => id !== post._id);
    await user.save();

    await Comment.deleteMany({ post: post._id });

    return res.status(200).json({
      success: true,
      message: "post delted successfully",
      post,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const bookmarkPost = async (req, res) => {
  try {
    const auther = req.user;
    if (!auther) {
      return res.status(400).json({
        success: false,
        message: "Bad Authentication",
      });
    }

    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "invalid post id",
      });
    }

    const user = await User.findById(auther._id);

    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        success: true,
        message: "bookmark removed successfully",
        type: "remove",
        post,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();

      return res.status(200).json({
        success: true,
        message: "bookmark added successfully",
        type: "add",
        post,
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
