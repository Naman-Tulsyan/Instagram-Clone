import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  deleteImageFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { Post } from "../models/post.model.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existedEmail = await User.findOne({
      email: email,
    });
    if (existedEmail) {
      return res.status(400).json({
        success: false,
        message: "email already exist",
      });
    }

    const existedUsername = await User.findOne({
      username: username,
    });
    if (existedUsername) {
      return res.status(400).json({
        success: false,
        message: "username already exist",
      });
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedpassword,
    });

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: user,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exist",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "incorrect password",
      });
    }

    const accessToken = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET
    );

    const loggedInUser = await User.findById(user._id)
      .select("-password")
      .populate({ path: "posts" })
      .populate({ path: "bookmarks" });

    if (!loggedInUser) {
      return res.status(500).json({
        success: false,
        message: "Server error while logging in user",
      });
    }
    // to make sure cookies are not modified in frontend
    const options = {
      httpOnly: true,
      sameSite: "Strict",
    };

    return res.status(200).cookie("accessToken", accessToken, options).json({
      success: true,
      message: "User logged in successfully",
      user: loggedInUser,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    return res.status(200).clearCookie("accessToken").json({
      message: "user logged out successfully",
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const loggedInUser = await User.findById(userId)
      .select("-password")
      .populate({ path: "posts" })
      .populate({ path: "bookmarks" });

    if (!loggedInUser) {
      return res.status(500).json({
        success: false,
        message: "Server error while fetching user",
      });
    }
    return res.status(200).json({
      success: true,
      message: "user fetched successfully",
      user: loggedInUser,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { bio, gender } = req.body;

    if (!gender) {
      return res.status(400).json({
        success: false,
        message: "Gender is required",
      });
    }

    const isGenderCorrect = ["male", "female", "other"].includes(gender);
    if (!isGenderCorrect) {
      return res.status(400).json({
        success: false,
        message: "Assign correct value to gender",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          bio: bio || "",
          gender,
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    await updatedUser.populate({ path: "posts" });
    await updatedUser.populate({ path: "bookmarks" });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editAvatar = async (req, res) => {
  try {
    // Delete old avatar from Cloudinary if it exists
    if (req.user?.avatar) {
      await deleteImageFromCloudinary(req.user.avatar);
    }

    const avatarLocalPath = req.file?.path;
    if (!avatarLocalPath) {
      return res.status(400).json({
        success: false,
        message: "No avatar file uploaded",
      });
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { avatar: avatar?.url || "" },
      },
      { new: true, runValidators: true }
    ).select("-password");

    await updatedUser.populate({ path: "posts" });
    await updatedUser.populate({ path: "bookmarks" });

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserSuggestion = async (req, res) => {
  try {
    const suggestedUser = await User.find({
      _id: { $ne: req.user._id },
    }).select("-password");

    if (!suggestedUser) {
      return res.status(500).json({
        success: false,
        message: "Server error while getting user suggestion",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User suggestion get successfully",
      user: suggestedUser,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};

export const handleFollowUnfollow = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.id;

    if (userId == friendId) {
      return res.status(500).json({
        success: false,
        message: "Bad Request",
      });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend || !user) {
      return res.status(500).json({
        success: false,
        message: `not a valid user`,
      });
    }

    const isFollowing = user.followings.includes(friend._id);
    if (isFollowing) {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $pull: { followings: friend._id } }
        ),
        User.updateOne({ _id: friend._id }, { $pull: { followers: user._id } }),
      ]);
      return res.status(200).json({
        success: true,
        message: "Unfollowed successfully",
      });
    } else {
      await Promise.all([
        User.updateOne(
          { _id: user._id },
          { $push: { followings: friend._id } }
        ),
        User.updateOne({ _id: friend._id }, { $push: { followers: user._id } }),
      ]);
      return res.status(200).json({
        success: true,
        message: "followed successfully",
      });
    }
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message,
    });
  }
};
