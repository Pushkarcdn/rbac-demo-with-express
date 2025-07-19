import successResponse from "../../utils/responses/successResponse.js";
import {
  ConflictException,
  NotFoundException,
} from "../../exceptions/index.js";

import models from "../../models/index.js";
import { hashPassword } from "../../lib/bcrypt.js";
import { logAuditEvent } from "../../lib/auditLogger.js";

const { users, roles } = models;

const registerUser = async (req, res, next) => {
  try {
    const payload = req.body;

    // check if role exists
    const role = await roles.findById(payload.role_id);
    if (!role) {
      // Log role not found error
      await logAuditEvent({
        user_id: "000000000000000000000000", // Placeholder ID for system
        event_type: "SIGNUP",
        resource: "AUTH",
        endpoint: req.path,
        details: {
          email: payload.email,
          username: payload.username,
          role_id: payload.role_id,
          reason: "Role not found",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new NotFoundException("Role not found!", "role");
    }

    // check if email is already taken
    let existingUser = await users.findOne({
      where: { email: payload.email },
    });

    if (existingUser) {
      // Log duplicate email error
      await logAuditEvent({
        user_id: "000000000000000000000000", // Placeholder ID for system
        event_type: "SIGNUP",
        resource: "AUTH",
        endpoint: req.path,
        details: {
          email: payload.email,
          reason: "Email already taken",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new ConflictException("duplicateData", "user");
    }

    // check if username is already taken
    existingUser = await users.findOne({
      where: { username: payload.username },
    });

    if (existingUser) {
      // Log duplicate username error
      await logAuditEvent({
        user_id: "000000000000000000000000", // Placeholder ID for system
        event_type: "SIGNUP",
        resource: "AUTH",
        endpoint: req.path,
        details: {
          username: payload.username,
          reason: "Username already taken",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new ConflictException("duplicateData", "user");
    }

    payload.password_hash = await hashPassword(payload.password);

    const newUser = await users.create({ ...payload });

    // Log successful signup
    await logAuditEvent({
      user_id: newUser._id,
      event_type: "SIGNUP",
      resource: "AUTH",
      endpoint: req.path,
      details: {
        email: newUser.email,
        username: newUser.username,
        role_name: role.role_name,
      },
      ip_address: req.ip,
      status: "SUCCESS",
    });

    return successResponse(res, {}, "Signup successful!", "Signup");
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
};
