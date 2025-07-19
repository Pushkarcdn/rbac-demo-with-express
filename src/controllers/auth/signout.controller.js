import { AuthException } from "../../exceptions/index.js";
import successResponse from "../../utils/responses/successResponse.js";
import { logAuditEvent } from "../../lib/auditLogger.js";
import { verifyAccessToken } from "../../lib/jwt.js";

const logoutUser = async (req, res, next) => {
  try {
    const accessTokenFromCookie = req.cookies.accessToken;

    if (!accessTokenFromCookie)
      throw new AuthException("Signed out already!", "signout");

    // Get user ID from token for audit log
    try {
      const payload = await verifyAccessToken(accessTokenFromCookie, {
        ignoreExpiration: true,
      });
      if (payload && payload.sub) {
        // Log successful logout
        await logAuditEvent({
          user_id: payload.sub,
          event_type: "LOGOUT",
          resource: "AUTH",
          endpoint: req.path,
          details: {},
          ip_address: req.ip,
          status: "SUCCESS",
        });
      }
    } catch (tokenError) {
      console.error(
        "Error extracting user ID from token for logout audit:",
        tokenError,
      );
    }

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return successResponse(
      res,
      "User signed out successfully!",
      "loggedOut",
      "auth.signout",
    );
  } catch (error) {
    next(error);
  }
};

export default { logoutUser };
