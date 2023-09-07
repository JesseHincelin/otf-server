import { Router } from "express";
import { todoController } from "../controllers/todo.controller.js";

const initTodoRoutes = (app, sm, jwt) => {
  const router = Router();
  router.post("/create-todo", jwt, sm, todoController.newTodo);
  router.delete("/delete-todo/:todoId", jwt, sm, todoController.deleteTodo);
  router.patch("/edit-todo", jwt, sm, todoController.editTodo);

  app.use("/todos", router);
};

export default initTodoRoutes;
