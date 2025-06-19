import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  addComment,
  addPost,
  bookmarkPost,
  deletePost,
  dislikePost,
  getAllPost,
  getCommentsForPost,
  getUserPost,
  likePost,
} from "../controllers/post.controller.js";

const router = Router();

const uploadImage = upload.single("image");

router.route("/add").post(verifyJWT, uploadImage, addPost);
router.route("/getAll").get(verifyJWT, getAllPost);
router.route("/getUserPost").get(verifyJWT, getUserPost);
router.route("/:id/like").post(verifyJWT, likePost);
router.route("/:id/dislike").post(verifyJWT, dislikePost);
router.route("/addComments/:id").post(verifyJWT, addComment);
router.route("/getComments/:id").get(verifyJWT, getCommentsForPost);
router.route("/delete/:id").delete(verifyJWT, deletePost);
router.route("/bookmark/:id").post(verifyJWT, bookmarkPost);

export default router;
