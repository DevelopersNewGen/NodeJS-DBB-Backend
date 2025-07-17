import { Router } from "express";
import { login } from "./auth.controller.js";
import { validatorLogin } from "../middlewares/user-validator.js";

const router = Router();

router.post("/login",  login);

export default router;