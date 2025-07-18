import UsersController from "../controllers/users/users.controller.js";

export default (router) => {
  router.route("/users").get(UsersController.getUsers);

  router.route("/users/:id").get(UsersController.getUserById);

  router.route("/users/:id").put(UsersController.updateUser);

  router.route("/users/:id").delete(UsersController.deleteUser);
};
