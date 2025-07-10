import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import {
  ConflictException,
  NotFoundException,
} from "../../exceptions/index.js";

const { permissions } = models;

const getPermissions = async (req, res, next) => {
  try {
    const permissionsList = await permissions.find();
    return successResponse(
      res,
      permissionsList,
      "Permissions fetched successfully!",
      "permissions",
    );
  } catch (error) {
    next(error);
  }
};

const createPermission = async (req, res, next) => {
  try {
    // check if permission name already exists
    const existingPermission = await permissions.findOne({
      permission_name: req.body.permission_name,
    });
    if (existingPermission) {
      throw new ConflictException("Permission already exists!");
    }
    const permission = await permissions.create(req.body);
    return successResponse(
      res,
      permission,
      "Permission created successfully!",
      "permissions",
    );
  } catch (error) {
    next(error);
  }
};

const getPermissionById = async (req, res, next) => {
  try {
    const permission = await permissions.findById(req.params.id);
    if (!permission) {
      throw new NotFoundException("Permission not found!");
    }
    return successResponse(
      res,
      permission,
      "Permission fetched successfully!",
      "permissions",
    );
  } catch (error) {
    next(error);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    // check if permission exist
    let permission = await permissions.findById(req.params.id);
    if (!permission) {
      throw new NotFoundException("Permission not found!");
    }

    // check if permission name already exists
    let existingPermission = await permissions.findOne({
      permission_name: req.body.permission_name,
    });
    if (existingPermission) {
      throw new ConflictException("Permission name already exists!");
    }
    permission = await permissions.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    return successResponse(
      res,
      permission,
      "Permission updated successfully!",
      "permissions",
    );
  } catch (error) {
    next(error);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    // check if permission exist
    const permission = await permissions.findById(req.params.id);
    if (!permission) {
      throw new NotFoundException("Permission not found!");
    }
    await permissions.findByIdAndDelete(req.params.id);
    return successResponse(
      res,
      {},
      "Permission deleted successfully!",
      "permissions",
    );
  } catch (error) {
    next(error);
  }
};

export default {
  getPermissions,
  createPermission,
  getPermissionById,
  updatePermission,
  deletePermission,
};
