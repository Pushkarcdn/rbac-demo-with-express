import { AuthException } from "../../exceptions/index.js";
import successResponse from "../../utils/responses/successResponse.js";

const logoutUser = async (req, res, next) => {
  try {
    const accessTokenFromCookie = req.cookies.accessToken;

    if (!accessTokenFromCookie)
      throw new AuthException("Signed out already!", "signout");

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
