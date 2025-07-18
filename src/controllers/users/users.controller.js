import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import {
  ConflictException,
  NotFoundException,
} from "../../exceptions/index.js";

const { users } = models;

const getUsers = async (req, res, next) => {
  try {
    let usersList = await users.find().populate("role_id").lean();

    usersList = usersList.filter(
      (user) => user?.role_id?.role_name !== "SuperAdmin",
    );

    return successResponse(
      res,
      usersList,
      "Users fetched successfully!",
      "users",
    );
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await users.findById(req.params.id);
    if (!user) throw new NotFoundException("User not found!", "users");

    return successResponse(res, user, "User fetched successfully!", "users");
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    // check if role name already exists
    const existingUser = await users.findOne({
      username: req.body.username,
    });
    if (existingUser) {
      throw new ConflictException("User already exists!");
    }
    const user = await users.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) throw new NotFoundException("User not found!", "users");

    return successResponse(res, user, "User updated successfully!", "users");
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    // check if record exist
    const user = await users.findById(req.params.id);
    if (!user) throw new NotFoundException("User not found!", "users");

    await users.findByIdAndDelete(req.params.id);
    return successResponse(res, {}, "User deleted successfully!", "users");
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};
