"use strict";

import { dbConnection } from "./mongo.js";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import createDefaultAdmin from "./adminDefault.js";
import apiLimiter from "../src/middlewares/rate-limit-validator.js";
import authRoutes from "../src/auth/auth.routes.js";
import userRoutes from "../src/user/user.routes.js";
import accountsRoutes from "../src/accounts/accounts.routes.js";
import productRoutes from "../src/product/product.routes.js";

const middlewares = (app) => {
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(apiLimiter);
};

const routes = (app) => {
  app.use("/DBB/v1/auth", authRoutes);
  app.use("/DBB/v1/user", userRoutes);
  app.use("/DBB/v1/accounts", accountsRoutes);
  app.use("/DBB/v1/products", productRoutes);
};

const conectarDB = async () => {
  try {
    await dbConnection();
    await createDefaultAdmin();
  } catch (err) {
    console.log(`Database connection failed: ${err}`);
    process.exit(1);
  }
};

export const initServer = () => {
  const app = express();
  try {
    middlewares(app);
    conectarDB();
    routes(app);
    const port = process.env.PORT;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.log(`Server init failed: ${err}`);
  }
};
