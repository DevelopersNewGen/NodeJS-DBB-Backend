import { Router } from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    buyProduct
} from "./product.controller.js";

import {
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductByIdValidator,
    buyProductValidator 
} from "../middlewares/product-validator.js";

const router = Router();

router.post("/", createProductValidator, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductByIdValidator, getProductById);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);
router.post("/buy/:id", buyProductValidator, buyProduct);
export default router;

