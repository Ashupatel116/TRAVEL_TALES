import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

// ----------- GET USERS (Protected) -----------
router.get("/getusers", verifyToken, getUser);



export default router;
