import RolePermissionsController from "../controllers/role_permissions/role_permissions.controller.js";

export default (router) => {
  router
    .route("/role-permissions")
    .post(RolePermissionsController.createRolePermission);

  router
    .route("/role-permissions")
    .get(RolePermissionsController.getRolePermissions);

  router
    .route("/role-permissions/:id")
    .get(RolePermissionsController.getRolePermissionById);

  router
    .route("/role-permissions/role/:roleId")
    .get(RolePermissionsController.getRolePermissionByRoleId);

  router
    .route("/role-permissions/:id")
    .put(RolePermissionsController.updateRolePermission);

  router
    .route("/role-permissions/:id")
    .delete(RolePermissionsController.deleteRolePermission);
};
