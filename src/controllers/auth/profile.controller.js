import { AuthException } from "../../exceptions/index.js";
import successResponse from "../../utils/responses/successResponse.js";
import { sanitizePayload } from "../../utils/filters/payloadFilter.js";

const currentUser = async (req, res, next) => {
  try {
    if (!req?.user) throw new AuthException("unauthorized", "auth");

    let userData = req?.user;

    userData = sanitizePayload(userData, ["password", "password_hash"]);

    return successResponse(res, userData, "User fetched successfully!", "auth");
  } catch (err) {
    next(err);
  }
};

export default { currentUser };
