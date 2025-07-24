import { Router } from "express";
import { exchangeConverter } from "./exchange.controller.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ExchangeRequest:
 *       type: object
 *       required:
 *         - from
 *         - to
 *         - amount
 *       properties:
 *         from:
 *           type: string
 *           description: Código de moneda de origen (ej. USD, EUR, GTQ)
 *           pattern: '^[A-Z]{3}$'
 *           example: "USD"
 *         to:
 *           type: string
 *           description: Código de moneda de destino (ej. USD, EUR, GTQ)
 *           pattern: '^[A-Z]{3}$'
 *           example: "GTQ"
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Cantidad a convertir
 *           example: 100.00
 *       example:
 *         from: "USD"
 *         to: "GTQ"
 *         amount: 100.00
 *     ExchangeResponse:
 *       type: object
 *       properties:
 *         base:
 *           type: string
 *           description: Moneda base (origen)
 *           example: "USD"
 *         target:
 *           type: string
 *           description: Moneda objetivo (destino)
 *           example: "GTQ"
 *         conversionRate:
 *           type: number
 *           description: Tasa de conversión entre las monedas
 *           example: 7.75
 *         conversionAmount:
 *           type: number
 *           description: Cantidad convertida final
 *           example: 775.00
 *       example:
 *         base: "USD"
 *         target: "GTQ"
 *         conversionRate: 7.75
 *         conversionAmount: 775.00
 *     ExchangeErrorResponse:
 *       type: object
 *       properties:
 *         msg:
 *           type: string
 *           description: Mensaje de error
 *         details:
 *           type: object
 *           description: Detalles adicionales del error de la API externa
 *         error:
 *           type: string
 *           description: Mensaje específico del error interno
 *       example:
 *         msg: "Error al convertir las divisas"
 *         details: {}
 */

/**
 * @swagger
 * /exchange/:
 *   post:
 *     summary: Convertir divisas usando tasas de cambio en tiempo real
 *     description: Realiza la conversión de una cantidad de dinero entre dos divisas utilizando una API externa de tasas de cambio actualizadas.
 *     tags: [Exchange]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExchangeRequest'
 *     responses:
 *       200:
 *         description: Conversión realizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExchangeResponse'
 *       400:
 *         description: Error en la conversión o parámetros inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExchangeErrorResponse'
 *             examples:
 *               invalid_currency:
 *                 summary: Código de moneda inválido
 *                 value:
 *                   msg: "Error al convertir las divisas"
 *                   details:
 *                     error-type: "unsupported-code"
 *                     result: "error"
 *               conversion_failed:
 *                 summary: Error en la conversión
 *                 value:
 *                   msg: "Error al convertir las divisas"
 *                   details:
 *                     result: "error"
 *       500:
 *         description: Error interno del servidor o problema con la API externa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExchangeErrorResponse'
 *             example:
 *               msg: "Error al realizar la conversión de divisas"
 *               error: "Network timeout or API unavailable"
 */
router.post("/", exchangeConverter);

export default router;