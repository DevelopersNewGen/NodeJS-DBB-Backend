import { Router } from "express";
import {
  createAccount,
  listAccounts,
  listAccountsByUser,
  getAccountById,
} from "./accounts.controller.js";
import {
  createAccountValidator,
  listAccountsByUserValidator,
  getAccountByIdValidator
} from "../middlewares/accounts-validator.js";
import { checkAccountTypeExists } from "../middlewares/checkAccountTypeExists.js";

const router = Router();

router.post("/createAccount/:uid", createAccountValidator,checkAccountTypeExists, createAccount);

router.get("/listAccounts", listAccounts);

router.get("/user/:uid", listAccountsByUserValidator, listAccountsByUser);

router.get("/:aid", getAccountByIdValidator, getAccountById);

export default router;
