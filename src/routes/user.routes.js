import { Router } from "express";
import { userController } from "../controllers/user.controller.js";

const initUserRoutes = (app, sm, jwt) => {
  const router = Router();
  router.post("/login", sm, userController.login);
  router.patch("/change-password", jwt, sm, userController.changePassword);
  router.patch("/change-theme", jwt, sm, userController.changeTheme);
  router.post("/create-categorie", jwt, sm, userController.createCategorie);
  router.patch("/edit-categorie", jwt, sm, userController.editCategorie);
  router.delete("/delete-categorie/:categorieId", jwt, sm, userController.deleteCategorie);

  app.use("/user", router);
};

export default initUserRoutes;
