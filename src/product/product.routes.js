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

const router = Router();

router.post("/", createProductValidator, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductByIdValidator, getProductById);
router.put("/:id", updateProductValidator, updateProduct);
router.delete("/:id", deleteProductValidator, deleteProduct);
export default router;

