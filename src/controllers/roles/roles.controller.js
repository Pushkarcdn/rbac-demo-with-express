import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import {
  ConflictException,
  NotFoundException,
} from "../../exceptions/index.js";

const { roles } = models;

const getRoles = async (req, res, next) => {
  try {
    let rolesList = await roles.find();

    rolesList = rolesList.filter((role) => role.role_name !== "SuperAdmin");

    return successResponse(
      res,
      rolesList,
      "Roles fetched successfully!",
      "roles",
    );
  } catch (error) {
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    // check if role name already exists
    const existingRole = await roles.findOne({ role_name: req.body.role_name });
    if (existingRole) {
      throw new ConflictException("Role already exists!");
    }
    const role = await roles.create(req.body);
    return successResponse(res, role, "Role created successfully!", "roles");
  } catch (error) {
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const role = await roles.findById(req.params.id);
    if (!role) throw new NotFoundException("Role not found!", "roles");

    return successResponse(res, role, "Role fetched successfully!", "roles");
  } catch (error) {
    next(error);
  }
};

const updateRole = async (req, res, next) => {
  try {
    // check if role name already exists
    const existingRole = await roles.findOne({ role_name: req.body.role_name });
    if (existingRole) {
      throw new ConflictException("Role name already exists!");
    }
    const role = await roles.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!role) throw new NotFoundException("Role not found!", "roles");

    return successResponse(res, role, "Role updated successfully!", "roles");
  } catch (error) {
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    // check if record exist
    const role = await roles.findById(req.params.id);
    if (!role) throw new NotFoundException("Role not found!", "roles");

    await roles.findByIdAndDelete(req.params.id);
    return successResponse(res, {}, "Role deleted successfully!", "roles");
  } catch (error) {
    next(error);
  }
};

export default { getRoles, createRole, getRoleById, updateRole, deleteRole };
