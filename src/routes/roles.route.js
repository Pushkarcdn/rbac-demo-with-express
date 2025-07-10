import RolesController from "../controllers/roles/roles.controller.js";

export default (router) => {
  router.route("/roles").post(RolesController.createRole);

  router.route("/roles").get(RolesController.getRoles);

  router.route("/roles/:id").get(RolesController.getRoleById);

  router.route("/roles/:id").put(RolesController.updateRole);

  router.route("/roles/:id").delete(RolesController.deleteRole);
};
