import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Bookmark, Grid } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { USER_API_URL } from "@/config/config";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";

const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const { user } = useSelector((store) => store.auth);
  const [activeTab, setActiveTab] = useState("posts");
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  const dispatch = useDispatch();

  const [editedProfile, setEditedProfile] = useState({
    username: "",
    bio: "",
    gender: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const isOwnProfile = !userId || userId === user?._id;

  const isFollowing = (friendId) => user?.followings?.includes(friendId);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const targetUserId = userId || user._id;
        const { data } = await axios.get(
          `${USER_API_URL}/${targetUserId}/profile`,
          { withCredentials: true }
        );
        setUserProfile(data.user);
        setEditedProfile({
          username: data.user.username,
          bio: data.user.bio || "",
          gender: data.user.gender || "",
        });
        setPreviewUrl(data.user.avatar || "");
        setPosts(data.user.posts);
        setBookmarks(data.user.bookmarks);
        toast.success("Fetched user profile");
      } catch (error) {
        toast.error("Failed to get user profile");
      }
    };
    if (user) getProfile();
  }, [userId]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async () => {
    try {
      if (!editedProfile.gender) {
        return toast.error("Gender is required");
      }

      setIsSaving(true);

      const profileData = {
        bio: editedProfile.bio,
        gender: editedProfile.gender,
      };

      const { data } = await axios.post(
        `${USER_API_URL}/editProfile`,
        profileData,
        {
          withCredentials: true,
        }
      );

      setUserProfile(data.user);
      setPosts(data.user.posts);
      setBookmarks(data.user.bookmarks);
      dispatch(setAuthUser(data.user));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleAvatarUpdate = async () => {
    if (!avatarFile) return toast.error("Please select an avatar image");
    
    try {
      setIsSaving(true);
      
      const formData = new FormData();
      formData.append("avatar", avatarFile);
      
      const { data } = await axios.post(
        `${USER_API_URL}/editAvatar`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      
      dispatch(setAuthUser(data.user));
      setPosts(data.user.posts);
      setBookmarks(data.user.bookmarks);
      setUserProfile({...userProfile, avatar: data?.user?.avatar});
      setAvatarFile(null);
      toast.success("Avatar updated successfully");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update avatar");
    } finally {
      setIsSaving(false);
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
      // Update userProfile state safely
      setUserProfile((userProfile) => {
        const isCurrentlyFollowing = userProfile.followers?.includes(user?._id);
        const updatedFollowers = isCurrentlyFollowing
          ? userProfile.followers?.filter((id) => id !== user?._id)
          : [...userProfile.followers, user?._id];

        return { ...userProfile, followers: updatedFollowers };
      });

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

  const renderGrid = (items) => (
  <div className="grid grid-cols-3 gap-1 md:gap-2 mt-6">
    {items?.map((item, index) => (
      <div
        key={index}
        className="relative aspect-square group bg-gray-100 dark:bg-gray-800 overflow-hidden"
      >
        <img
          src={item.image}
          alt={`post-${index}`}
          className="w-full h-full object-cover"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm gap-4">
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1.01 4.13 2.44h1.75C14.09 5.01 15.76 4 17.5 4 20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span>{item.likes?.length || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M20 2H4C2.897 2 2 2.897 2 4v18l4-4h14c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z" />
            </svg>
            <span>{item.comments?.length || 0}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);



  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b pb-6">
        {/* Avatar upload dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <div>
              <Avatar className="w-28 h-28 cursor-pointer ring-2 ring-gray-300 hover:ring-pink-500 transition">
                <AvatarImage src={previewUrl} />
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </div>
          </DialogTrigger>
          {isOwnProfile && (
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Avatar</DialogTitle>
              </DialogHeader>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Button
                disabled={isSaving}
                onClick={handleAvatarUpdate}
                className="w-full mt-2"
              >
                {isSaving ? "Saving Avatar..." : "Save Avatar"}
              </Button>
            </DialogContent>
          )}
        </Dialog>

        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">{userProfile?.username}</h2>

            {/* Edit Profile Dialog */}
            {isOwnProfile ? (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="text-sm">
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editedProfile.username}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          username: e.target.value,
                        })
                      }
                      disabled={true}
                    />

                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) =>
                        setEditedProfile({
                          ...editedProfile,
                          bio: e.target.value,
                        })
                      }
                    />

                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={editedProfile.gender}
                      onValueChange={(value) =>
                        setEditedProfile({ ...editedProfile, gender: value })
                      }
                      required={true}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      disabled={isSaving}
                      onClick={handleProfileUpdate}
                      className="w-full mt-2"
                    >
                      {isSaving ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            ) : isFollowing(userProfile?._id) ? (
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="text-sm px-4 py-2 rounded-2xl hover:bg-destructive/10 border border-destructive text-destructive"
                  onClick={() => handleFollowUnfollow(userProfile._id)}
                >
                  Unfollow
                </Button>
                <Button
                  variant="default"
                  className="text-sm px-4 py-2 rounded-2xl bg-primary hover:bg-primary/90"
                >
                  Message
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                className="text-sm px-6 py-2 rounded-2xl bg-primary hover:bg-primary/90"
                onClick={() => handleFollowUnfollow(userProfile._id)}
              >
                Follow
              </Button>
            )}
          </div>

          <div className="flex gap-6 text-sm mb-2">
            <span>
              <strong>{userProfile?.posts?.length}</strong> posts
            </span>
            <span>
              <strong>{userProfile?.followers?.length || 0}</strong> followers
            </span>
            <span>
              <strong>{userProfile?.followings?.length || 0}</strong> following
            </span>
          </div>

          {userProfile?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {userProfile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-12 text-sm font-medium mt-6 border-t pt-4">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-1 pb-2 border-b-2 transition ${
            activeTab === "posts"
              ? "border-black dark:border-white"
              : "border-transparent text-gray-500"
          }`}
        >
          <Grid className="w-4 h-4" />
          Posts
        </button>

        <button
          onClick={() => setActiveTab("bookmarks")}
          className={`flex items-center gap-1 pb-2 border-b-2 transition ${
            activeTab === "bookmarks"
              ? "border-black dark:border-white"
              : "border-transparent text-gray-500"
          }`}
        >
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </button>
      </div>

      {/* Content */}
      {activeTab === "posts" && renderGrid(posts)}
      {activeTab === "bookmarks" && renderGrid(bookmarks)}
    </div>
  );
};

export default Profile;
