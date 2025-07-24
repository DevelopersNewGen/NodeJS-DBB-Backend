import {Router} from 'express';
import { createUser, getUsers, getUserById, updateUser, updateUserPassword, deleteUserAdmin, updateUserAdmin, updateRole, getUserLogged, favoriteAccount} from './user.controller.js';
import { createUserValidator, listUsersValidator, getUserByIdValidator, 
    updateUserValidator, updatePasswordValidator, deleteUserValidatorAdmin, updateUserValidatorAdmin, validateUpdateRole, getRoleValidator,favoriteAccountValidator } from '../middlewares/user-validator.js';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único del usuario
 *         name:
 *           type: string
 *           maxLength: 35
 *           description: Nombre completo del usuario
 *         username:
 *           type: string
 *           maxLength: 20
 *           description: Nombre de usuario único
 *         accounts:
 *           type: array
 *           items:
 *             type: string
 *           description: Array de IDs de cuentas asociadas
 *         dpi:
 *           type: string
 *           description: Documento Personal de Identificación (único)
 *         address:
 *           type: string
 *           description: Dirección del usuario
 *         cellphone:
 *           type: string
 *           description: Número de teléfono celular
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico único
 *         jobName:
 *           type: string
 *           description: Nombre del trabajo/profesión
 *         monthlyIncome:
 *           type: number
 *           description: Ingresos mensuales
 *         role:
 *           type: string
 *           enum: [ADMIN_ROLE, CLIENT_ROLE]
 *           description: Rol del usuario en el sistema
 *         favs:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               accountNumber:
 *                 type: string
 *                 description: Número de cuenta favorita
 *               alias:
 *                 type: string
 *                 description: Alias para la cuenta favorita
 *         status:
 *           type: boolean
 *           description: Estado activo/inactivo del usuario
 *       example:
 *         uid: "60d5ecb74b0c1234567890ab"
 *         name: "Juan Carlos Pérez"
 *         username: "jcperez"
 *         dpi: "1234567890123"
 *         address: "Zona 10, Ciudad de Guatemala"
 *         cellphone: "50212345678"
 *         email: "jcperez@email.com"
 *         jobName: "Ingeniero en Sistemas"
 *         monthlyIncome: 8500.00
 *         role: "CLIENT_ROLE"
 *         status: true
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - dpi
 *         - address
 *         - cellphone
 *         - email
 *         - password
 *         - jobName
 *         - monthlyIncome
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 35
 *           description: Nombre completo del usuario
 *         username:
 *           type: string
 *           maxLength: 20
 *           description: Nombre de usuario único
 *         dpi:
 *           type: string
 *           description: Documento Personal de Identificación
 *         address:
 *           type: string
 *           description: Dirección del usuario
 *         cellphone:
 *           type: string
 *           description: Número de teléfono celular
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *         jobName:
 *           type: string
 *           description: Trabajo/profesión del usuario
 *         monthlyIncome:
 *           type: number
 *           minimum: 0
 *           description: Ingresos mensuales
 *       example:
 *         name: "Ana María López"
 *         username: "amlopez"
 *         dpi: "9876543210987"
 *         address: "Zona 15, Guatemala"
 *         cellphone: "50298765432"
 *         email: "amlopez@email.com"
 *         password: "miContraseñaSegura123"
 *         jobName: "Contadora"
 *         monthlyIncome: 6500.00
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           maxLength: 20
 *           description: Nombre de usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico
 *         address:
 *           type: string
 *           description: Dirección del usuario
 *         cellphone:
 *           type: string
 *           description: Número de teléfono
 *         jobName:
 *           type: string
 *           description: Trabajo/profesión
 *         monthlyIncome:
 *           type: number
 *           minimum: 0
 *           description: Ingresos mensuales
 *       example:
 *         address: "Nueva dirección, Zona 12"
 *         cellphone: "50211111111"
 *         monthlyIncome: 7000.00
 *     UpdatePasswordRequest:
 *       type: object
 *       required:
 *         - contraActual
 *         - nuevaContra
 *         - confirmacionContra
 *       properties:
 *         contraActual:
 *           type: string
 *           format: password
 *           description: Contraseña actual del usuario
 *         nuevaContra:
 *           type: string
 *           format: password
 *           description: Nueva contraseña
 *         confirmacionContra:
 *           type: string
 *           format: password
 *           description: Confirmación de la nueva contraseña
 *       example:
 *         contraActual: "miContraseñaActual"
 *         nuevaContra: "miNuevaContraseña123"
 *         confirmacionContra: "miNuevaContraseña123"
 *     UpdateRoleRequest:
 *       type: object
 *       required:
 *         - newRole
 *       properties:
 *         newRole:
 *           type: string
 *           enum: [ADMIN_ROLE, CLIENT_ROLE]
 *           description: Nuevo rol para el usuario
 *       example:
 *         newRole: "ADMIN_ROLE"
 *     FavoriteAccountRequest:
 *       type: object
 *       required:
 *         - accountNumber
 *       properties:
 *         accountNumber:
 *           type: string
 *           description: Número de cuenta a agregar como favorita
 *         alias:
 *           type: string
 *           description: Alias opcional para la cuenta favorita
 *       example:
 *         accountNumber: "1234567890"
 *         alias: "Cuenta de Ahorros Principal"
 */

/**
 * @swagger
 * /user/createUser:
 *   post:
 *     summary: Crear un nuevo usuario del banco
 *     description: Registra un nuevo cliente en el sistema bancario con toda la información personal y financiera requerida.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "User created successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de entrada inválidos o usuario ya existe
 *       500:
 *         description: Error interno del servidor
 */
router.post('/createUser', createUserValidator, createUser);

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Obtener todos los usuarios (Solo Administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Users retrieved successfully"
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: No se encontraron usuarios
 *       500:
 *         description: Error interno del servidor
 */
router.get('/', listUsersValidator, getUsers);

/**
 * @swagger
 * /user/findUser/{uid}:
 *   get:
 *     summary: Obtener un usuario específico por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/findUser/:uid', getUserByIdValidator, getUserById);

/**
 * @swagger
 * /user/deleteUserAdmin/{uid}:
 *   delete:
 *     summary: Eliminar un usuario (Solo Administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Usuario eliminado"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.delete("/deleteUserAdmin/:uid", deleteUserValidatorAdmin, deleteUserAdmin);

/**
 * @swagger
 * /user/updateUser:
 *   put:
 *     summary: Actualizar información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/updateUser', updateUserValidator, updateUser);

/**
 * @swagger
 * /user/updateUserAdmin/{uid}:
 *   put:
 *     summary: Actualizar cualquier usuario (Solo Administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Usuario Actualizado"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/updateUserAdmin/:uid", updateUserValidatorAdmin, updateUserAdmin);

/**
 * @swagger
 * /user/updatePassword:
 *   patch:
 *     summary: Cambiar contraseña del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdatePasswordRequest'
 *     responses:
 *       200:
 *         description: Contraseña actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Contraseña actualizada exitosamente"
 *       400:
 *         description: Contraseña actual incorrecta o las nuevas contraseñas no coinciden
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch('/updatePassword', updatePasswordValidator, updateUserPassword);

/**
 * @swagger
 * /user/updateRole/{uid}:
 *   patch:
 *     summary: Cambiar rol de un usuario (Solo Administradores)
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Rol actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 msg:
 *                   type: string
 *                   example: "Usuario Actualizado"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/updateRole/:uid", validateUpdateRole, updateRole);

/**
 * @swagger
 * /user/getUser:
 *   get:
 *     summary: Obtener información del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Información del usuario obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                     - type: object
 *                       properties:
 *                         favs:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               accountNumber:
 *                                 type: string
 *                               alias:
 *                                 type: string
 *       401:
 *         description: Token no válido
 *       500:
 *         description: Error interno del servidor
 */
router.get("/getUser", getRoleValidator, getUserLogged)

/**
 * @swagger
 * /user/favoriteAccount:
 *   patch:
 *     summary: Agregar cuenta a favoritos del usuario autenticado
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/FavoriteAccountRequest'
 *     responses:
 *       200:
 *         description: Cuenta agregada a favoritos exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Account favorited successfully"
 *                 favorites:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       accountNumber:
 *                         type: string
 *                       alias:
 *                         type: string
 *       400:
 *         description: Cuenta ya está en favoritos
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Cuenta o usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/favoriteAccount", favoriteAccountValidator, favoriteAccount);

export default router;