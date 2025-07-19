import { match } from "node-match-path";
import publicPermission from "../configs/public.permissions.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { AuthException } from "../exceptions/index.js";
import models from "../models/index.js";
import { logAuditEvent } from "../lib/auditLogger.js";

const { users, roles, role_permissions, permissions } = models;

const authMiddleware = (req, res, next) => {
  try {
    const isPublicRoute = publicPermission.some((item) => {
      const { matches } = match(item.route, req.path);
      const isMethodMatch = item.methods.includes(req.method);
      return matches && isMethodMatch;
    });

    // if (isPublicRoute) {
    //   next();
    // } else {
    //   authenticateUser(req, res, next, isPublicRoute);
    // }

    authenticateUser(req, res, next, isPublicRoute);
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;

const authenticateUser = async (req, res, next, isPublicRoute) => {
  try {
    const accessToken = req.cookies.accessToken;
    const payload = await verifyAccessToken(accessToken);

    const user = await users.findById(payload?.sub).populate({
      path: "role_id",
      model: "Roles",
      select: ["id", "role_name"],
    });

    if (!user) {
      // Log unauthorized access attempt
      await logAuditEvent({
        user_id: payload?.sub || "000000000000000000000000", // Use a placeholder ID if no user
        event_type: "ACCESS_DENIED",
        resource: "AUTHENTICATION",
        endpoint: req.path,
        details: {
          method: req.method,
          reason: "User not found",
          token_payload: payload,
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      if (!isPublicRoute) {
        throw new AuthException("unauthorized", "auth");
      }
    }

    req.user = await user?.toJSON();

    next();
  } catch (err) {
    // If the error is not already handled, log it
    if (!err.logged) {
      try {
        // Extract user ID from token if possible
        let userId = "000000000000000000000000"; // Default placeholder
        try {
          const accessToken = req.cookies.accessToken;
          if (accessToken) {
            const payload = await verifyAccessToken(accessToken, {
              ignoreExpiration: true,
            });
            if (payload && payload.sub) {
              userId = payload.sub;
            }
          }
        } catch (tokenErr) {
          // Ignore token errors, just use the placeholder ID
        }

        await logAuditEvent({
          user_id: userId,
          event_type: "ACCESS_DENIED",
          resource: "AUTHENTICATION",
          endpoint: req.path,
          details: {
            method: req.method,
            reason: err.message || "Authentication failed",
            error: err.message,
          },
          ip_address: req.ip,
          status: "FAILURE",
        });

        // Mark as logged to prevent duplicate logging
        err.logged = true;
      } catch (logErr) {
        console.error("Failed to log authentication error:", logErr);
      }
    }

    next(err);
  }
};

export const authorizeUser = async (req, permission_name) => {
  try {
    // extracting user and redis client from request object
    const user = req.user;
    const redis = req.redis;

    if (user.role_id.role_name === "SuperAdmin") return;

    // logging for debugging purposes
    console.log(user?.username + " is trying to access " + permission_name);

    // extracting role id from user object
    const roleId = user.role_id;

    // trying to get role from Redis cache first
    const roleKey = `role:${roleId}`;
    let role = await redis.get(roleKey);

    if (!role) {
      // if not found in cache, let's fetch from database
      role = await roles.findById(roleId);

      // then storing in Redis with 10 minute expiration
      await redis.set(roleKey, JSON.stringify(role), { EX: 600 });
    } else {
      role = JSON.parse(role);
    }

    if (role.role_name === "admin") return;

    // trying to get permission from Redis cache
    const permissionKey = `permission:${permission_name}`;
    let permission = await redis.get(permissionKey);

    if (!permission) {
      // if not found in cache, let's fetch from database
      permission = await permissions.findOne({ permission_name });

      // then storing in Redis with 10 minute expiration
      await redis.set(permissionKey, JSON.stringify(permission), { EX: 600 });
    } else {
      permission = JSON.parse(permission);
    }

    // trying to get role permission from Redis cache
    const rolePermKey = `rolePermission:${roleId}:${permission._id}`;
    let rolePermission = await redis.get(rolePermKey);

    if (!rolePermission) {
      // if not found in cache, let's fetch from database
      rolePermission = await role_permissions.findOne({
        role_id: roleId,
        permission_id: permission._id,
      });

      // then storing in Redis with 10 minute expiration (null check to avoid storing null)
      if (rolePermission) {
        await redis.set(rolePermKey, JSON.stringify(rolePermission), {
          EX: 600,
        });
      } else {
        await redis.set(rolePermKey, JSON.stringify(null), { EX: 600 });
      }
    } else {
      rolePermission = JSON.parse(rolePermission);
    }

    if (!rolePermission) {
      // Log permission denied
      await logAuditEvent({
        user_id: user._id,
        event_type: "ACCESS_DENIED",
        resource: "PERMISSION",
        endpoint: req.path,
        details: {
          method: req.method,
          permission_name,
          role_name: role.role_name,
          reason: "Permission not granted to role",
        },
        ip_address: req.ip,
        status: "FAILURE",
      });

      throw new AuthException("unauthorized", "auth");
    }

    return;
  } catch (err) {
    throw new AuthException("unauthorized", "auth");
  }
};
