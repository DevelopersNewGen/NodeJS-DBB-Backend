import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { productExists } from "../helpers/db-validator.js";

export const createProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 35 }).withMessage("Name cannot exceed 35 characters"),
    body("category")
        .notEmpty().withMessage("Category is required")
        .isIn(["Product", "Service"]).withMessage("Category must be 'Product' or 'Service'"),
    body("description")
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
    validateField,
    handleErrors
];

export const updateProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("The ID is not valid"),
    param("id").custom(productExists),
    body("name")
        .optional()
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 35 }).withMessage("Name cannot exceed 35 characters"),
    body("category")
        .optional()
        .notEmpty().withMessage("Category is required")
        .isIn(["Product", "Service"]).withMessage("Category must be 'Product' or 'Service'"),
    body("description")
        .optional()
        .notEmpty().withMessage("Description is required")
        .isLength({ max: 500 }).withMessage("Description cannot exceed 500 characters"),
    validateField,
    handleErrors
];

export const deleteProductValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("id").isMongoId().withMessage("The ID is not valid"),
    param("id").custom(productExists),
    validateField,
    handleErrors
];

export const getProductByIdValidator = [
    validateJWT,
    param("id").isMongoId().withMessage("The ID is not valid"),
    param("id").custom(productExists),
    validateField,
    handleErrors
];
