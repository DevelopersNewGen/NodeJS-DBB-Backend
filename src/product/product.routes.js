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

router.post("/add", uploadProductImg.single("img"), createProductValidator, createProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductByIdValidator, getProductById);
router.put("/update/:id", updateProductValidator, updateProduct);
router.delete("/delete/:id", deleteProductValidator, deleteProduct);
export default router;

