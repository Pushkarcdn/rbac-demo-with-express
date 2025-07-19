import { AuthException } from "../../exceptions/index.js";
import successResponse from "../../utils/responses/successResponse.js";
import { signAccessToken } from "../../lib/jwt.js";
import { verifyHashedPassword } from "../../lib/bcrypt.js";
import { logAuditEvent } from "../../lib/auditLogger.js";

import models from "../../models/index.js";

const { users } = models;

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const existingUser = await users.findOne({ email });

    if (!existingUser) {
      // Log failed login attempt
      await logAuditEvent({
        user_id: "000000000000000000000000", // Placeholder ID since user doesn't exist
        event_type: "LOGIN",
        resource: "AUTH",
        endpoint: req.path,
        details: {
          email,
          reason: "User not found",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new AuthException("Invalid credentials!", "auth1");
    }

    const isMatch = await verifyHashedPassword(
      password,
      existingUser.password_hash,
    );

    if (!isMatch) {
      // Log failed login attempt due to wrong password
      await logAuditEvent({
        user_id: existingUser._id,
        event_type: "LOGIN",
        resource: "AUTH",
        endpoint: req.path,
        details: {
          email,
          reason: "Invalid password",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new AuthException("Invalid credentials!", "auth2");
    }

    // Log successful login
    await logAuditEvent({
      user_id: existingUser._id,
      event_type: "LOGIN",
      resource: "AUTH",
      endpoint: req.path,
      details: {
        email,
        username: existingUser.username,
      },
      ip_address: req.ip,
      status: "SUCCESS",
    });

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
