import { jwtMiddleware } from "../middlewares/jwt.middleware.js";
import { sanitizeMiddleware } from "../middlewares/sanitize.middleware.js";
import initAdminRoutes from "./admin.routes.js";
import initTodoRoutes from "./todo.routes.js";
import initUserRoutes from "./user.routes.js";

const initRoutes = (app) => {
  initUserRoutes(app, sanitizeMiddleware, jwtMiddleware);
  initAdminRoutes(app, sanitizeMiddleware, jwtMiddleware);
  initTodoRoutes(app, sanitizeMiddleware, jwtMiddleware);
};

export default initRoutes;
