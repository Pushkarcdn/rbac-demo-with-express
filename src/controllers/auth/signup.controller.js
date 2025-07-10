import successResponse from "../../utils/responses/successResponse.js";
import {
  ConflictException,
  NotFoundException,
} from "../../exceptions/index.js";

import models from "../../models/index.js";
import { hashPassword } from "../../lib/bcrypt.js";

const { users, roles } = models;

const registerUser = async (req, res, next) => {
  try {
    const payload = req.body;

    // check if role exists
    const role = await roles.findById(payload.role_id);
    if (!role) throw new NotFoundException("Role not found!", "role");

    // check if email is already taken
    let existingUser = await users.findOne({
      where: { email: payload.email },
    });

    if (existingUser) throw new ConflictException("duplicateData", "user");

    // check if username is already taken
    existingUser = await users.findOne({
      where: { username: payload.username },
    });

    if (existingUser) throw new ConflictException("duplicateData", "user");

    payload.password_hash = await hashPassword(payload.password);

    const newUser = await users.create({ ...payload });

    return successResponse(res, {}, "Signup successful!", "Signup");
  } catch (error) {
    next(error);
  }
};

export default {
  registerUser,
};
