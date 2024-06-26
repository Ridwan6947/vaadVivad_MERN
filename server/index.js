import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { Register } from "./controller/auth.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import { verifyToken } from "./middleware/auth.js";
import {createPost} from "./controller/posts.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// CONFIGURATION
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets"))); // set directory where we store images locally

// FILE STORAGE
const storage = multer.diskStorage({          //save files to disk
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({storage }); // file upload variable

// ROUTES WITH FILES
app.post("/auth/register" , upload.single("picture") , Register)
app.use("/posts",verifyToken, upload.single("picture"), createPost);

// ROUTES
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts",postRoutes);

//MONGOOSE SETUP
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() =>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
    console.log("MongoDB Connected")
}).catch(() =>{
    console.log(error.message);
})