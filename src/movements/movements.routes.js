import { Router } from "express";
import {makeTransfer, getAccountMovements, getMyRecentMovements, getTopMovements, makeDeposit, revertDepositAmount, updateDepositAmount, 
    makeWithdrawal, getAllMovements, getUserMovements, getMovemntsById} from "./movement.controller.js"
import { makeTransferValidator, getAccountMovementsValidator, getMyRecentMovementsValidator,getTopMovementsValidator,makeDepositValidator, 
    revertDepositValidator, updateDepositValidator, validateGetUserMovements, withdrawalValidator, validateGetAllMovements, getMovementsByIdValidator } from "../middlewares/movements-validator.js";
import { validateDepositTimeLimit } from "../middlewares/deposit-time-limit-validator.js"; 
import { validateTransferLimits } from "../middlewares/transfer-limit-validator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Movement:
 *       type: object
 *       properties:
 *         mid:
 *           type: string
 *           description: ID único del movimiento
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha y hora del movimiento
 *         amount:
 *           type: number
 *           description: Cantidad del movimiento
 *         type:
 *           type: string
 *           enum: [DEPOSIT, WITHDRAWAL, TRANSFER_IN, TRANSFER_OUT]
 *           description: Tipo de movimiento
 *         description:
 *           type: string
 *           description: Descripción del movimiento
 *         balanceAfter:
 *           type: number
 *           description: Saldo después del movimiento
 *         originAccount:
 *           type: string
 *           description: ID de la cuenta de origen
 *         destinationAccount:
 *           type: string
 *           description: ID de la cuenta de destino
 *         status:
 *           type: string
 *           enum: [COMPLETED, REVERTED, PENDING, FAILED]
 *           description: Estado del movimiento
 *       example:
 *         mid: "60d5ecb74b0c1234567890ab"
 *         date: "2025-07-24T10:30:00.000Z"
 *         amount: 500.00
 *         type: "DEPOSIT"
 *         description: "Depósito administrativo"
 *         balanceAfter: 1500.00
 *         originAccount: null
 *         destinationAccount: "60d5ecb74b0c1234567890cd"
 *         status: "COMPLETED"
 *     DepositRequest:
 *       type: object
 *       required:
 *         - destinationAccount
 *         - amount
 *       properties:
 *         destinationAccount:
 *           type: string
 *           description: Número de cuenta de destino
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Cantidad a depositar
 *       example:
 *         destinationAccount: "1234567890"
 *         amount: 500.00
 *     WithdrawalRequest:
 *       type: object
 *       required:
 *         - accountNumber
 *         - amount
 *       properties:
 *         accountNumber:
 *           type: string
 *           description: Número de cuenta para retiro
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Cantidad a retirar
 *       example:
 *         accountNumber: "1234567890"
 *         amount: 200.00
 *     TransferRequest:
 *       type: object
 *       required:
 *         - destinationAccount
 *         - amount
 *       properties:
 *         destinationAccount:
 *           type: string
 *           description: Número de cuenta de destino
 *         amount:
 *           type: number
 *           minimum: 0.01
 *           description: Cantidad a transferir
 *       example:
 *         destinationAccount: "0987654321"
 *         amount: 300.00
 *     UpdateDepositRequest:
 *       type: object
 *       required:
 *         - newAmount
 *       properties:
 *         newAmount:
 *           type: number
 *           minimum: 0.01
 *           description: Nueva cantidad para el depósito
 *       example:
 *         newAmount: 750.00
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /movement/deposit:
 *   post:
 *     summary: Realizar un depósito (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DepositRequest'
 *     responses:
 *       201:
 *         description: Depósito realizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Deposit completed successfully"
 *                 movement:
 *                   $ref: '#/components/schemas/Movement'
 *       400:
 *         description: Datos inválidos o cuenta no encontrada
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       500:
 *         description: Error interno del servidor
 */
router.post("/deposit", makeDepositValidator, makeDeposit)

/**
 * @swagger
 * /movement/deposit/{mid}:
 *   patch:
 *     summary: Actualizar monto de un depósito (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDepositRequest'
 *     responses:
 *       200:
 *         description: Depósito actualizado exitosamente
 *       400:
 *         description: Datos inválidos o tiempo límite excedido
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/deposit/:mid", updateDepositValidator, validateDepositTimeLimit, updateDepositAmount)

/**
 * @swagger
 * /movement/deposit/{mid}:
 *   delete:
 *     summary: Revertir un depósito (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento a revertir
 *     responses:
 *       200:
 *         description: Depósito revertido exitosamente
 *       400:
 *         description: Tiempo límite excedido para revertir
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/deposit/:mid", revertDepositValidator, validateDepositTimeLimit, revertDepositAmount)

/**
 * @swagger
 * /movement/withdrawal:
 *   post:
 *     summary: Realizar un retiro (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/WithdrawalRequest'
 *     responses:
 *       201:
 *         description: Retiro realizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Withdrawal completed successfully"
 *                 movement:
 *                   $ref: '#/components/schemas/Movement'
 *       400:
 *         description: Fondos insuficientes o cuenta no encontrada
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes
 *       500:
 *         description: Error interno del servidor
 */
router.post("/withdrawal", withdrawalValidator,makeWithdrawal)

/**
 * @swagger
 * /movement/account/{aid}:
 *   get:
 *     summary: Obtener movimientos de una cuenta específica
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Movimientos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Account movements retrieved successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/account/:aid", getAccountMovementsValidator, getAccountMovements)

/**
 * @swagger
 * /movement/top:
 *   get:
 *     summary: Obtener movimientos con mayores montos (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top movimientos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Top movements retrieved successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       500:
 *         description: Error interno del servidor
 */
router.get("/top", getTopMovementsValidator, getTopMovements)

/**
 * @swagger
 * /movement/transfer/{originAccount}:
 *   post:
 *     summary: Realizar una transferencia entre cuentas
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: originAccount
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de cuenta de origen
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferRequest'
 *     responses:
 *       201:
 *         description: Transferencia realizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Transfer completed successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *       400:
 *         description: Fondos insuficientes, cuentas no encontradas o límites excedidos
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol CLIENT)
 *       500:
 *         description: Error interno del servidor
 */
router.post("/transfer/:originAccount", makeTransferValidator, validateTransferLimits,  makeTransfer)

/**
 * @swagger
 * /movement/recent/{accountNumber}:
 *   get:
 *     summary: Obtener movimientos recientes de una cuenta
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Número de cuenta
 *     responses:
 *       200:
 *         description: Movimientos recientes obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Recent movements retrieved successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol CLIENT)
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/recent/:accountNumber",getMyRecentMovementsValidator, getMyRecentMovements )

/**
 * @swagger
 * /movement/:
 *   get:
 *     summary: Obtener todos los movimientos del sistema (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de resultados
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Offset para paginación
 *     responses:
 *       200:
 *         description: Todos los movimientos obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "All movements retrieved successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *                 total:
 *                   type: integer
 *                   description: Total de movimientos
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       500:
 *         description: Error interno del servidor
 */
router.get("/", validateGetAllMovements, getAllMovements)

/**
 * @swagger
 * /movement/user:
 *   get:
 *     summary: Obtener movimientos del usuario autenticado
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Número máximo de resultados
 *       - in: query
 *         name: from
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Offset para paginación
 *     responses:
 *       200:
 *         description: Movimientos del usuario obtenidos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User movements retrieved successfully"
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Movement'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes
 *       500:
 *         description: Error interno del servidor
 */
router.get("/user", validateGetUserMovements, getUserMovements)

/**
 * @swagger
 * /movement/{mid}:
 *   get:
 *     summary: Obtener un movimiento específico por ID (Solo Administradores)
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: mid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del movimiento
 *     responses:
 *       200:
 *         description: Movimiento obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Movement retrieved successfully"
 *                 movement:
 *                   $ref: '#/components/schemas/Movement'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Movimiento no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:mid", getMovementsByIdValidator, getMovemntsById)

export default router