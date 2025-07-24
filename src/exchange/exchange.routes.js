import { Router } from "express";
import { exchangeConverter } from "./exchange.controller.js";

const router = Router();

router.post("/", exchangeConverter);

export default router;