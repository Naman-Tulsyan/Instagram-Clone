import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: [true, "password is required"],
        },
        avatar: {
            type: String, // cloudinary URL
        },
        bio: {
            type: String,
            default: ""
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"]
        },
        followers: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        followings: [{
            type: Schema.Types.ObjectId,
            ref: "User",
        }],
        posts: [{
            type: Schema.Types.ObjectId,
            ref: "Post",
        }],
        bookmarks: [{
            type: Schema.Types.ObjectId,
            ref: "Post",
        }],
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema);
