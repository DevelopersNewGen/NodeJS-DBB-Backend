import { Router } from "express";
import { getVoucherPDF, getMovementsExcel } from "./report.controller.js";
import { voucherPDFValidator, movementsCSVValidator } from "../middlewares/report-validator.js";

const router = Router();

router.get("/voucher/:mid", voucherPDFValidator, getVoucherPDF)

router.get("/movements", movementsCSVValidator, getMovementsExcel)

export default router