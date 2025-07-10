import SignupController from "../controllers/auth/signup.controller.js";
import SigninController from "../controllers/auth/signin.controller.js";
import SignoutController from "../controllers/auth/signout.controller.js";
import ProfileController from "../controllers/auth/profile.controller.js";

export default (router) => {
  router.route("/auth/register").post(SignupController.registerUser);

  router.route("/auth/login").post(SigninController.loginUser);

  router.route("/auth/logout").get(SignoutController.logoutUser);

  router.route("/auth/me").get(ProfileController.currentUser);
};
