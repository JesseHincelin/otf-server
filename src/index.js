import express from "express";
import initRoutes from "./routes/routes.js";
import initMiddlewares from "./middlewares/init.middleware.js";
import initDb from "./config/database.config.js";

const app = express();
const PORT = process.env.PORT;

await initDb();
initMiddlewares(app);
initRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
