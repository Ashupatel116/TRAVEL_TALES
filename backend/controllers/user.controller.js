import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const validUser = await User.findById(userId);
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }

    const { password: pass, ...rest } = validUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
