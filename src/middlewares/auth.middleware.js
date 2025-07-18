import { match } from "node-match-path";
import publicPermission from "../configs/public.permissions.js";
import { verifyAccessToken } from "../lib/jwt.js";
import { AuthException } from "../exceptions/index.js";
import models from "../models/index.js";

const { users, roles, role_permissions, permissions } = models;

const authMiddleware = (req, res, next) => {
  try {
    const isPublicRoute = publicPermission.some((item) => {
      const { matches } = match(item.route, req.path);
      const isMethodMatch = item.methods.includes(req.method);
      return matches && isMethodMatch;
    });

    if (isPublicRoute) {
      next();
    } else {
      authenticateUser(req, res, next);
    }
  } catch (err) {
    next(err);
  }
};

export default authMiddleware;

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;
    const payload = await verifyAccessToken(accessToken);

    const user = await users.findById(payload.sub).populate({
      path: "role_id",
      model: "Roles",
      select: ["id", "role_name"],
    });

    if (!user) throw new AuthException("unauthorized", "auth");

    req.user = await user.toJSON();

    next();
  } catch (err) {
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

    if (!rolePermission) throw new AuthException("unauthorized", "auth");

    return;
  } catch (err) {
    throw new AuthException("unauthorized", "auth");
  }
};
