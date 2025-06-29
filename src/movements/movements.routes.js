import { Router } from "express";
import {makeTransfer, getAccountMovements, getMyRecentMovements, getTopMovements, makeDeposit, revertDepositAmount, updateDepositAmount, 
    makeWithdrawal, getAllMovements, getUserMovements} from "./movement.controller.js"
import { makeTransferValidator, getAccountMovementsValidator, getMyRecentMovementsValidator,getTopMovementsValidator,makeDepositValidator, 
    revertDepositValidator, updateDepositValidator, validateGetUserMovements, withdrawalValidator, validateGetAllMovements } from "../middlewares/movements-validator.js";
import { validateDepositTimeLimit } from "../middlewares/deposit-time-limit-validator.js"; 
import { validateTransferLimits } from "../middlewares/transfer-limit-validator.js";

const router = Router();

router.post("/deposit", makeDepositValidator, makeDeposit)

router.patch("/deposit/:mid", updateDepositValidator, validateDepositTimeLimit, updateDepositAmount)

router.delete("/deposit/:mid", revertDepositValidator, validateDepositTimeLimit, revertDepositAmount)

router.post("/withdrawal", withdrawalValidator,makeWithdrawal)

router.get("/account/:aid", getAccountMovementsValidator, getAccountMovements)

router.get("/top", getTopMovementsValidator, getTopMovements)

router.post("/transfer/:originAccount", makeTransferValidator, validateTransferLimits,  makeTransfer)

router.get("/recent/:aid",getMyRecentMovementsValidator, getMyRecentMovements )

router.get("/", validateGetAllMovements, getAllMovements)

router.get("/user", validateGetUserMovements, getUserMovements)

export default router