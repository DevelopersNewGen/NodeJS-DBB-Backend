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

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único de la cuenta
 *         accountNumber:
 *           type: string
 *           description: Número de cuenta único
 *         balance:
 *           type: number
 *           description: Saldo de la cuenta
 *         accountType:
 *           type: string
 *           enum: [MONETARY, SAVER, OTHER]
 *           description: Tipo de cuenta
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo de la cuenta
 *         user:
 *           type: string
 *           description: ID del usuario propietario
 *       example:
 *         uid: "60d5ecb74b0c1234567890ab"
 *         accountNumber: "1234567890"
 *         balance: 1500.50
 *         accountType: "MONETARY"
 *         status: true
 *         user: "60d5ecb74b0c1234567890cd"
 *     CreateAccountRequest:
 *       type: object
 *       required:
 *         - accountType
 *         - balance
 *       properties:
 *         accountType:
 *           type: string
 *           enum: [MONETARY, SAVER, OTHER]
 *           description: Tipo de cuenta a crear
 *         balance:
 *           type: number
 *           minimum: 0
 *           description: Saldo inicial de la cuenta
 *       example:
 *         accountType: "MONETARY"
 *         balance: 1000.00
 *     RecentMovementsRequest:
 *       type: object
 *       required:
 *         - accountNumber
 *       properties:
 *         accountNumber:
 *           type: string
 *           description: Número de cuenta para consultar movimientos
 *       example:
 *         accountNumber: "1234567890"
 */

/**
 * @swagger
 * /accounts/createAccount/{uid}:
 *   post:
 *     summary: Crear una nueva cuenta para un usuario
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario para quien se creará la cuenta
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAccountRequest'
 *     responses:
 *       201:
 *         description: Cuenta creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Account created successfully"
 *                 account:
 *                   $ref: '#/components/schemas/Account'
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Usuario no encontrado o inactivo
 *       500:
 *         description: Error interno del servidor
 */
router.post("/createAccount/:uid", createAccountValidator, createAccount);

/**
 * @swagger
 * /accounts/listAccounts:
 *   get:
 *     summary: Listar todas las cuentas
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: Lista de cuentas obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Accounts retrieved successfully"
 *                 accounts:
 *                   type: array
 *                   items:
 *                     allOf:
 *                       - $ref: '#/components/schemas/Account'
 *                       - type: object
 *                         properties:
 *                           user:
 *                             type: object
 *                             properties:
 *                               name:
 *                                 type: string
 *                                 description: Nombre del usuario propietario
 *       500:
 *         description: Error interno del servidor
 */
router.get("/listAccounts", listAccounts);

/**
 * @swagger
 * /accounts/user/{uid}:
 *   get:
 *     summary: Listar cuentas de un usuario específico
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Cuentas del usuario obtenidas exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Accounts retrieved successfully"
 *                 accounts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Account'
 *                 name:
 *                   type: string
 *                   description: Nombre del usuario
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get("/user/:uid", listAccountsByUserValidator, listAccountsByUser);

/**
 * @swagger
 * /accounts/{aid}:
 *   get:
 *     summary: Obtener cuenta por ID
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la cuenta
 *     responses:
 *       200:
 *         description: Cuenta obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Account retrieved successfully"
 *                 account:
 *                   $ref: '#/components/schemas/Account'
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.get("/:aid", getAccountByIdValidator, getAccountById);

/**
 * @swagger
 * /accounts/recent-movements:
 *   post:
 *     summary: Obtener movimientos recientes de una cuenta
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RecentMovementsRequest'
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
 *                     type: object
 *                     description: Movimiento bancario
 *       400:
 *         description: Número de cuenta es requerido
 *       404:
 *         description: Cuenta no encontrada
 *       500:
 *         description: Error interno del servidor
 */
router.post("/recent-movements",getAccountRecentMovementsValidator, getAccountRecentMovements);

export default router;
