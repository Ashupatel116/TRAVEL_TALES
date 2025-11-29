import express from "express";
import { signin, signup } from "../controllers/auth.controller.js";

const router = express.Router();

// ---------------- SIGNUP ----------------
router.post("/signup", signup);

// ---------------- SIGNIN ----------------
router.post("/signin", signin);

// ---------------- LOGOUT ----------------
router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error while logging out",
    });
  }
});

export default router;
