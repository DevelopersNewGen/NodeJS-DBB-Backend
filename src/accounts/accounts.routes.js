import { Router } from "express";
import {
  createAccount,
  listAccounts,
  listAccountsByUser,
  getAccountById,
  getAccountRecentMovements,
} from "./accounts.controller.js";
import {
  createAccountValidator,
  listAccountsByUserValidator,
  getAccountByIdValidator,
  getAccountRecentMovementsValidator
} from "../middlewares/accounts-validator.js";

const router = Router();

router.post("/createAccount/:uid", createAccountValidator, createAccount);

router.get("/listAccounts", listAccounts);

router.get("/user/:uid", listAccountsByUserValidator, listAccountsByUser);

router.get("/:aid", getAccountByIdValidator, getAccountById);

router.post("/recent-movements",getAccountRecentMovementsValidator, getAccountRecentMovements);

export default router;
