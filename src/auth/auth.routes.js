import { Router } from "express";
import { login } from "./auth.controller.js";
import { validatorLogin } from "../middlewares/user-validator.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - emailOrUsername
 *         - password
 *       properties:
 *         emailOrUsername:
 *           type: string
 *           description: Email o nombre de usuario para iniciar sesión
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *       example:
 *         emailOrUsername: "user@example.com"
 *         password: "mySecurePassword123"
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica si el login fue exitoso
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del resultado
 *         userDetails:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               description: Email del usuario
 *             username:
 *               type: string
 *               description: Nombre de usuario
 *             img:
 *               type: string
 *               description: URL de la imagen de perfil
 *             token:
 *               type: string
 *               description: JWT token para autenticación
 *       example:
 *         success: true
 *         message: "Login successful"
 *         userDetails:
 *           email: "user@example.com"
 *           username: "myusername"
 *           img: "https://example.com/profile.jpg"
 *           token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indica que la operación falló
 *         message:
 *           type: string
 *           description: Mensaje descriptivo del error
 *         error:
 *           type: string
 *           description: Detalle específico del error
 *       example:
 *         success: false
 *         message: "Invalid credentials"
 *         error: "The password is incorrect"
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión en el sistema bancario
 *     description: Autentica a un usuario usando email/username y contraseña. Devuelve un JWT token para acceder a recursos protegidos.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Credenciales inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 summary: Usuario no encontrado
 *                 value:
 *                   success: false
 *                   message: "Invalid credential"
 *                   error: "There is no user with the entered email or username"
 *               wrong_password:
 *                 summary: Contraseña incorrecta
 *                 value:
 *                   success: false
 *                   message: "Invalid credentials"
 *                   error: "The password is incorrect"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Login failed, server error"
 *               error: "Database connection error"
 */
router.post("/login",  login);

export default router;