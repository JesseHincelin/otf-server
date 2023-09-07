import cors from "cors";
import express from "express";
import helmet from "helmet";

const initMiddlewares = (app) => {
  const corsOrigin = "*";
  // const corsOrigin = process.env.CORS_ORIGIN || "*";

  const corsOptions = {
    origin: corsOrigin,
  };

  // const whitelist = corsOrigin.split(",");
  // const corsOptions = {
  //   origin: (origin, callback) => {
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error("not allowed by CORS"));
  //     }
  //   },
  // };

  app.use(cors(corsOptions));
  app.use(helmet());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
};

export default initMiddlewares;
