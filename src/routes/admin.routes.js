import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";

const initAdminRoutes = (app, sm, jwt) => {
  const router = Router();
  router.post("/create-account", jwt, sm, adminController.createAccount);
  router.post("/create-admin", jwt, sm, adminController.createAdmin);
  router.patch("/reset-password", jwt, sm, adminController.resetPassword);
  router.patch("/edit-user", jwt, sm, adminController.editUser);
  router.delete("/delete-account/:idToDelete", jwt, sm, adminController.deleteAccount);
  router.get("/get-one-user/:userName", jwt, sm, adminController.getUserByName);
  router.get("/get-users", jwt, sm, adminController.getAllUsers);
  router.post("/create-groupe", jwt, sm, adminController.createGroupe);
  router.patch("/edit-groupe", jwt, sm, adminController.editGroupe);
  router.delete("/delete-groupe/:groupeId", jwt, sm, adminController.deleteGroupe);
  router.get("/get-groupes", jwt, sm, adminController.getAllGroupes);

  app.use("/admin", router);
};

export default initAdminRoutes;
