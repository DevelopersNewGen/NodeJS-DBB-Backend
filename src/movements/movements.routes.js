import { Router } from "express";
import {makeTransfer, getAccountMovements, getMyRecentMovements, getTopMovements, makeDeposit, revertDepositAmount, updateDepositAmount, makeWithdrawal} from "./movement.controller.js"
import { makeTransferValidator, getAccountMovementsValidator, getMyRecentMovementsValidator,getTopMovementsValidator,makeDepositValidator, revertDepositValidator, updateDepositValidator, withdrawalValidator } from "../middlewares/movements-validator.js";
import { validateDepositTimeLimit } from "../middlewares/deposit-time-limit-validator.js"; 
import { validateTransferLimits } from "../middlewares/transfer-limit-validator.js";

const router = Router();

router.post("/deposit", makeDepositValidator, makeDeposit)

router.patch("/deposit/:mid", updateDepositValidator, validateDepositTimeLimit, updateDepositAmount)

router.delete("/deposit/:mid", revertDepositValidator, validateDepositTimeLimit, revertDepositAmount)

router.patch("/withdrawal", withdrawalValidator,makeWithdrawal)

router.get("/account/:aid", getAccountMovementsValidator, getAccountMovements)

router.get("/top", getTopMovementsValidator, getTopMovements)

router.post("/transfer/:originAccount", makeTransferValidator, validateTransferLimits,  makeTransfer)

router.get("/recent/:aid",getMyRecentMovementsValidator, getMyRecentMovements )

export default router