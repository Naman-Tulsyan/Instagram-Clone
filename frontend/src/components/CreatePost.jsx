import React, { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { POST_API_URL } from "@/config/config";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePost = async () => {
    if (!image) {
      return toast.error("Image is required.");
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);

    try {
      await axios.post(`${POST_API_URL}/add`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      toast.success("Post created successfully!");
      setCaption("");
      setImage(null);
      setPreview(null);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create post");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400 px-3 py-2 rounded-lg transition-colors duration-200"
        >
          <ImagePlus className="h-5 w-5" />
          <span className="hidden md:inline text-base">Create New Post</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md bg-white dark:bg-gray-900 rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-800 dark:text-white">
            Create New Post
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  setImage(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 rounded-full p-1 h-6 w-6 text-xs"
              >
                ×
              </Button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-48 cursor-pointer">
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
              <ImagePlus className="h-8 w-8 text-gray-400" />
              <span className="text-gray-500 dark:text-gray-400 mt-2">
                Click to upload
              </span>
            </label>
          )}

          <Textarea
            placeholder="Write a caption..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="resize-none min-h-[80px]"
          />
        </div>

        <DialogFooter>
          <Button
            onClick={handlePost}
            disabled={isLoading || !image}
            className="w-full bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : null}
            {isLoading ? "Posting..." : "Post"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
