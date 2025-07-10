import PermissionsController from "../controllers/permissions/permissions.controller.js";

export default (router) => {
  router.route("/permissions").post(PermissionsController.createPermission);

  router.route("/permissions").get(PermissionsController.getPermissions);

  router.route("/permissions/:id").get(PermissionsController.getPermissionById);

  router.route("/permissions/:id").put(PermissionsController.updatePermission);

  router
    .route("/permissions/:id")
    .delete(PermissionsController.deletePermission);
};
