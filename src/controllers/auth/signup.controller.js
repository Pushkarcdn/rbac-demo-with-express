import successResponse from "../../utils/responses/successResponse.js";
import { ConflictException } from "../../exceptions/index.js";

import models from "../../models/index.js";
import { hashPassword } from "../../lib/bcrypt.js";

const { users } = models;

const registerUser = async (req, res, next) => {
  try {
    const payload = req.body;

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
