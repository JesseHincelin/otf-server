import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const initAdminRoutes = (app, sm, jwt) => {
  const router = Router();
  router.post("/create-account", jwt, sm, adminController.createAccount);
  router.post("/create-admin", jwt, sm, adminController.createAdmin);
  router.patch("/change-password", jwt, sm, adminController.resetPassword);
  router.patch("/edit-user", jwt, sm, adminController.editUser);
  router.delete("/delete-account/:idToDelete", jwt, sm, adminController.deleteAccount);
  router.get("/get-users", jwt, sm, adminController.getAllUsers);

  app.use("/admin", router);
};

export default initAdminRoutes;
