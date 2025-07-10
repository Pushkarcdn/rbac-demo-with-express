import { AuthException } from "../../exceptions/index.js";
import successResponse from "../../utils/responses/successResponse.js";
import { signAccessToken } from "../../lib/jwt.js";
import { verifyHashedPassword } from "../../lib/bcrypt.js";

import models from "../../models/index.js";

const { users } = models;

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await users.findOne({ email });

    if (!existingUser) throw new AuthException("Invalid credentials!", "auth1");

    const isMatch = await verifyHashedPassword(
      password,
      existingUser.password_hash,
    );

    if (!isMatch) throw new AuthException("Invalid credentials!", "auth2");

    processAuth(req, res, next, existingUser);
  } catch (error) {
    next(error);
  }
};

export const processAuth = async (req, res, next, user) => {
  try {
    const newAccessToken = await signAccessToken({
      userId: user?._id,
    });

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(res, {}, "Signin successful!", "auth");
  } catch (error) {
    next(error);
  }
};

export default { loginUser };
