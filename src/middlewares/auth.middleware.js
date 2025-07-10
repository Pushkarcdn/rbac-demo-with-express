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

    const user = await users.findById(payload.sub);

    if (!user) throw new AuthException("unauthorized", "auth");

    req.user = await user.toJSON();

    next();
  } catch (err) {
    next(err);
  }
};

export const authorizeUser = async (user, permission_name) => {
  try {
    console.log(user?.username + " is trying to access " + permission_name);

    const roleId = user.role_id;

    const role = await roles.findById(roleId);

    if (role.role_name === "admin") return;

    const permission = await permissions.findOne({ permission_name });

    const rolePermission = await role_permissions.findOne({
      role_id: roleId,
      permission_id: permission._id,
    });

    if (!rolePermission) throw new AuthException("unauthorized", "auth");

    return;
  } catch (err) {
    throw new AuthException("unauthorized", "auth");
  }
};
