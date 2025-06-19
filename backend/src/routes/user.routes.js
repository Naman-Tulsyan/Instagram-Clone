import { Router } from "express";
import {
  editAvatar,
  editProfile,
  getProfile,
  getUserSuggestion,
  handleFollowUnfollow,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

const uploadAvatar = upload.single("avatar");

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/:id/profile").get(verifyJWT, getProfile);
router.route("/editProfile").post(verifyJWT, editProfile);
router.route("/editAvatar").post(verifyJWT, uploadAvatar, editAvatar);
router.route("/getUserSuggestion").get(verifyJWT, getUserSuggestion);
router.route("/followUnfollow/:id").post(verifyJWT, handleFollowUnfollow);

export default router;
