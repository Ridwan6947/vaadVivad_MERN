import express from "express";
import {
    likePost,
    getUserPost,
    getFeedPosts,
} from "../controller/posts.js";
import {verifyToken} from "../middleware/auth.js";

const router = express.Router();

//READ
router.get("/" , verifyToken , getFeedPosts);
router.get("/:userId/posts" , verifyToken , getUserPost);


//UPDATE
router.patch("/:id/like" , verifyToken , likePost);

export default router;