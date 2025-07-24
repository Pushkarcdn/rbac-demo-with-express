import successResponse from "../../utils/responses/successResponse.js";
import models from "../../models/index.js";
import { AuthException, ConflictException } from "../../exceptions/index.js";
import { logAuditEvent } from "../../lib/auditLogger.js";
import { notifyAllClients } from "../../utils/websocket/socketNotifier.js";

const { role_permissions, roles, permissions } = models;

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
      // Log duplicate role permission

      await logAuditEvent({
        user_id: req.user._id,
        event_type: "PERMISSION_CHANGE",
        resource: "ROLE_PERMISSION",
        endpoint: req.path,
        details: {
          action: "CREATE",
          role_id: req.body.role_id,
          permission_id: req.body.permission_id,
          reason: "Role permission already exists",
          status: "FAILED",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new ConflictException("Role permission already exists!");
    }

    // Get role and permission details for logging
    const role = await roles.findById(req.body.role_id);
    const permission = await permissions.findById(req.body.permission_id);

    const rolePermission = await role_permissions.create(req.body);

    // Log successful role permission creation
    await logAuditEvent({
      user_id: req.user._id,
      event_type: "PERMISSION_CHANGE",
      resource: "ROLE_PERMISSION",
      endpoint: req.path,
      details: {
        action: "CREATE",
        role_id: req.body.role_id,
        permission_id: req.body.permission_id,
        role_name: role?.role_name || "Unknown Role",
        permission_name: permission?.permission_name || "Unknown Permission",
      },
      ip_address: req.ip,
      status: "SUCCESS",
    });

    // Sending WebSocket notification
    await notifyAllClients("permissions-updated", {
      message: "Permissions updated",
      action: "create",
      roleId: req.body.role_id,
      roleName: role?.role_name || "Unknown Role",
      permissionId: req.body.permission_id,
      permissionName: permission?.permission_name || "Unknown Permission",
    });

    // Clear Redis cache
    if (req.redis) {
      await req.redis.flushAll();
    }

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

const getRolePermissionByRoleId = async (req, res, next) => {
  try {
    const rolePermission = await role_permissions
      .find({
        role_id: req.params.roleId,
      })
      .populate("permission_id")
      .populate("role_id")
      .lean();

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
    // Get the original role permission for logging
    const originalRolePermission = await role_permissions.findById(
      req.params.id,
    );
    if (!originalRolePermission) {
      // Log not found error
      await logAuditEvent({
        user_id: req.user._id,
        event_type: "PERMISSION_CHANGE",
        resource: "ROLE_PERMISSION",
        endpoint: req.path,
        details: {
          action: "UPDATE",
          id: req.params.id,
          reason: "Role permission not found",
          status: "FAILED",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new AuthException("Unauthorized");
    }

    // check if same record exist
    const existingRolePermission = await role_permissions.findOne({
      role_id: req.body.role_id,
      permission_id: req.body.permission_id,
    });
    if (existingRolePermission) {
      // Log duplicate role permission
      await logAuditEvent({
        user_id: req.user._id,
        event_type: "PERMISSION_CHANGE",
        resource: "ROLE_PERMISSION",
        endpoint: req.path,
        details: {
          action: "UPDATE",
          id: req.params.id,
          role_id: req.body.role_id,
          permission_id: req.body.permission_id,
          reason: "Role permission already exists",
          status: "FAILED",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new ConflictException("Role permission already exists!");
    }

    // Get role and permission details for logging
    const role = await roles.findById(req.body.role_id);
    const permission = await permissions.findById(req.body.permission_id);

    const rolePermission = await role_permissions.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      },
    );

    // Log successful role permission update
    await logAuditEvent({
      user_id: req.user._id,
      event_type: "PERMISSION_CHANGE",
      resource: "ROLE_PERMISSION",
      endpoint: req.path,
      details: {
        action: "UPDATE",
        id: req.params.id,
        old_role_id: originalRolePermission.role_id,
        old_permission_id: originalRolePermission.permission_id,
        new_role_id: req.body.role_id,
        new_permission_id: req.body.permission_id,
        role_name: role?.role_name || "Unknown Role",
        permission_name: permission?.permission_name || "Unknown Permission",
      },
      ip_address: req.ip,
      status: "SUCCESS",
    });

    // Clear Redis cache
    if (req.redis) {
      await req.redis.flushAll();
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
      // Log not found error
      await logAuditEvent({
        user_id: req.user._id,
        event_type: "PERMISSION_CHANGE",
        resource: "ROLE_PERMISSION",
        endpoint: req.path,
        details: {
          action: "DELETE",
          id: req.params.id,
          reason: "Role permission not found",
          status: "FAILED",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new AuthException("Unauthorized");
    }

    // Get role and permission details for logging
    const role = await roles.findById(rolePermission.role_id);
    const permission = await permissions.findById(rolePermission.permission_id);

    await role_permissions.findByIdAndDelete(req.params.id);

    // Log successful role permission deletion
    await logAuditEvent({
      user_id: req.user._id,
      event_type: "PERMISSION_CHANGE",
      resource: "ROLE_PERMISSION",
      endpoint: req.path,
      details: {
        action: "DELETE",
        id: req.params.id,
        role_id: rolePermission.role_id,
        permission_id: rolePermission.permission_id,
        role_name: role?.role_name || "Unknown Role",
        permission_name: permission?.permission_name || "Unknown Permission",
      },
      ip_address: req.ip,
      status: "SUCCESS",
    });

    // Sending WebSocket notification to all connected clients
    await notifyAllClients("permissions-updated", {
      message: "Permissions updated",
      action: "delete",
      roleId: rolePermission.role_id,
      roleName: role?.role_name || "Unknown Role",
      permissionId: rolePermission.permission_id,
      permissionName: permission?.permission_name || "Unknown Permission",
    });

    // Clear Redis cache
    if (req.redis) {
      await req.redis.flushAll();
    }

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
  getRolePermissionByRoleId,
  updateRolePermission,
  deleteRolePermission,
};
