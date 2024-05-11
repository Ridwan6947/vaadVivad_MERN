import Post from "../models/Post.js"
import User from "../models/User.js";

//CREATE

export const createPost = async(req , res) =>{
    try {
        const {userId , description , picturePath} = req.body;
        const user = await User.findById(userId);
        const newPost = new Post({
            userId,
            firstName : user.firstName,
            lastName : user.lastName,
            location : user.location,
            description,
            userPicturePath : user.picturePath,
            picturePath,
            likes : {},
            comments : []
        })
        await newPost.save();
        const post = await Post.find();
        res.status(201).json(post);       //201 = created successfully

    } catch (err) {
        res.status(409).json({message : err.message});
    }
}

//READ

export const getFeedPosts = async(req , res) =>{
    try {
        const post = await Post.find();
        res.status(200).json(post);  // 200 = ok
    } catch (err) {
        res.status(404).json({message : err.message});
    }
}

export const getUserPost = async(req , res) =>{
    try {
        const {userId} = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (err) {
        res.status(404).json({message : err.message});
    }
}

//UPDATE

export const likePost = async (req , res) =>{
    try {
        const{id} = req.params;
        const {userId} = req.body;
        const post = await Post.findById(id);
        const isLiked = post.likes.get(userId);   // Check if the user has already liked the post

        if(isLiked){
            post.likes.delete(userId);  // If the user has already liked the post, remove the like
        }else{
            post.likes.set(userId , true); // If the user hasn't liked the post yet, add the like
        }

        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes : post.likes},
            {new : true}
        )
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(404).json({message : err.message}); 
    }
}