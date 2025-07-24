import { Router } from "express";
import { getVoucherPDF, getMovementsExcel } from "./report.controller.js";
import { voucherPDFValidator, movementsCSVValidator } from "../middlewares/report-validator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ReportError:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: string
 *           description: Detalle específico del error
 *       example:
 *         msg: "Error generating voucher"
 *         error: "Movement not found"
 */

/**
 * @swagger
 * /report/voucher/{mid}:
 *   get:
 *     summary: Generar voucher PDF de un movimiento bancario
 *     description: Genera un comprobante en formato PDF con los detalles completos de un movimiento bancario específico. El PDF incluye logo del banco, información del movimiento, cuentas involucradas y formato profesional.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento para el cual generar el voucher
 *         example: "60d5ecb74b0c1234567890ab"
 *     responses:
 *       200:
 *         description: Voucher PDF generado exitosamente
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo PDF del voucher bancario
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/pdf
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="voucher_60d5ecb74b0c1234567890ab.pdf"
 *       400:
 *         description: ID de movimiento inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *       401:
 *         description: Token no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *       403:
 *         description: Permisos insuficientes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *             example:
 *               msg: "Movement not found"
 *       500:
 *         description: Error interno del servidor al generar PDF
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *             example:
 *               msg: "Error generating voucher"
 *               error: "PDF generation failed"
 */
router.get("/voucher/:mid", voucherPDFValidator, getVoucherPDF)

/**
 * @swagger
 * /report/movements:
 *   get:
 *     summary: Generar reporte Excel de todos los movimientos (Solo Administradores)
 *     description: Genera un archivo Excel completo con todos los movimientos bancarios del sistema. Incluye formato profesional con encabezados, bordes y datos estructurados para análisis financiero.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte Excel generado exitosamente
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *               description: Archivo Excel con reporte de movimientos
 *         headers:
 *           Content-Type:
 *             schema:
 *               type: string
 *               example: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
 *           Content-Disposition:
 *             schema:
 *               type: string
 *               example: attachment; filename="movements_report.xlsx"
 *       401:
 *         description: Token no válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *       404:
 *         description: No se encontraron movimientos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *             example:
 *               msg: "No movements found"
 *       500:
 *         description: Error interno del servidor al generar Excel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReportError'
 *             example:
 *               msg: "Error generating Excel"
 *               error: "Workbook creation failed"
 */
router.get("/movements", movementsCSVValidator, getMovementsExcel)

export default router