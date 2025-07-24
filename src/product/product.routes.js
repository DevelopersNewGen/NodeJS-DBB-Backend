import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "./product.controller.js";

import {
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductByIdValidator
} from "../middlewares/product-validator.js";

import { uploadProductImg } from "../middlewares/img-uploader.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: ID único del producto
 *         productImg:
 *           type: string
 *           description: URL de la imagen del producto
 *         name:
 *           type: string
 *           maxLength: 35
 *           description: Nombre del producto o servicio
 *         category:
 *           type: string
 *           enum: [Product, Service]
 *           description: Categoría del producto
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Descripción detallada del producto
 *       example:
 *         uid: "60d5ecb74b0c1234567890ab"
 *         productImg: "https://cloudinary.com/image/product.jpg"
 *         name: "Cuenta de Ahorros Premium"
 *         category: "Service"
 *         description: "Cuenta de ahorros con beneficios exclusivos y tasas preferenciales para clientes premium"
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - category
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 35
 *           description: Nombre del producto o servicio
 *         category:
 *           type: string
 *           enum: [Product, Service]
 *           description: Categoría del producto
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Descripción detallada del producto
 *       example:
 *         name: "Tarjeta de Crédito Gold"
 *         category: "Product"
 *         description: "Tarjeta de crédito con límite alto y beneficios exclusivos para compras internacionales"
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 35
 *           description: Nombre del producto o servicio
 *         category:
 *           type: string
 *           enum: [Product, Service]
 *           description: Categoría del producto
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Descripción detallada del producto
 *       example:
 *         name: "Tarjeta de Crédito Platinum"
 *         description: "Tarjeta de crédito premium con beneficios exclusivos y límite extendido"
 *     ProductError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de error
 *         error:
 *           type: object
 *           description: Detalles del error
 *       example:
 *         message: "Error creating product"
 *         error: {}
 */

/**
 * @swagger
 * /products/add:
 *   post:
 *     summary: Crear un nuevo producto o servicio (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - description
 *             properties:
 *               img:
 *                 type: string
 *                 format: binary
 *                 description: Imagen del producto (opcional)
 *               name:
 *                 type: string
 *                 maxLength: 35
 *                 description: Nombre del producto o servicio
 *               category:
 *                 type: string
 *                 enum: [Product, Service]
 *                 description: Categoría del producto
 *               description:
 *                 type: string
 *                 maxLength: 500
 *                 description: Descripción detallada del producto
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
router.post("/add", uploadProductImg.single("img"), createProductValidator, createProduct);

/**
 * @swagger
 * /products/:
 *   get:
 *     summary: Obtener todos los productos y servicios
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
router.get("/", getAllProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtener un producto específico por ID
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: ID de producto inválido
 *       401:
 *         description: Token no válido
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
router.get("/:id", getProductByIdValidator, getProductById);

/**
 * @swagger
 * /products/update/{id}:
 *   put:
 *     summary: Actualizar un producto existente (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductRequest'
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       400:
 *         description: Datos de entrada inválidos o ID inválido
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
router.put("/update/:id", updateProductValidator, updateProduct);

/**
 * @swagger
 * /products/delete/{id}:
 *   delete:
 *     summary: Eliminar un producto (Solo Administradores)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto a eliminar
 *     responses:
 *       200:
 *         description: Producto eliminado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Product deleted"
 *       400:
 *         description: ID de producto inválido
 *       401:
 *         description: Token no válido
 *       403:
 *         description: Permisos insuficientes (se requiere rol ADMIN)
 *       404:
 *         description: Producto no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
router.delete("/delete/:id", deleteProductValidator, deleteProduct);

export default router;

