import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import { AuthException, ConflictException } from "../../exceptions/index.js";

const { role_permissions } = models;

const getRolePermissions = async (req, res, next) => {
  try {
    const rolePermissions = await role_permissions.find();
    return successResponse(
      res,
      rolePermissions,
      "Role permissions fetched successfully!",
      "rolePermissions",
    );
  } catch (error) {
    next(error);
  }
};

const createRolePermission = async (req, res, next) => {
  try {
    // check if same record exist
    const existingRolePermission = await role_permissions.findOne({
      role_id: req.body.role_id,
      permission_id: req.body.permission_id,
    });
    if (existingRolePermission) {
      throw new ConflictException("Role permission already exists!");
    }
    const rolePermission = await role_permissions.create(req.body);
    return successResponse(
      res,
      rolePermission,
      "Role permission created successfully!",
      "rolePermissions",
    );
  } catch (error) {
    next(error);
  }
};

const getRolePermissionById = async (req, res, next) => {
  try {
    const rolePermission = await role_permissions.findById(req.params.id);
    if (!rolePermission) {
      throw new AuthException("Unauthorized");
    }
    return successResponse(
      res,
      rolePermission,
      "Role permission fetched successfully!",
      "rolePermissions",
    );
  } catch (error) {
    next(error);
  }
};

const updateRolePermission = async (req, res, next) => {
  try {
    // check if same record exist
    const existingRolePermission = await role_permissions.findOne({
      role_id: req.body.role_id,
      permission_id: req.body.permission_id,
    });
    if (existingRolePermission) {
      throw new ConflictException("Role permission already exists!");
    }
    const rolePermission = await role_permissions.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );
    if (!rolePermission) {
      throw new AuthException("Unauthorized");
    }
    return successResponse(
      res,
      rolePermission,
      "Role permission updated successfully!",
      "rolePermissions",
    );
  } catch (error) {
    next(error);
  }
};

const deleteRolePermission = async (req, res, next) => {
  try {
    // check if record exist
    const rolePermission = await role_permissions.findById(req.params.id);
    if (!rolePermission) {
      throw new AuthException("Unauthorized");
    }
    await role_permissions.findByIdAndDelete(req.params.id);
    return successResponse(
      res,
      {},
      "Role permission deleted successfully!",
      "rolePermissions",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getRolePermissions,
  createRolePermission,
  getRolePermissionById,
  updateRolePermission,
  deleteRolePermission,
};
