import {body, param} from "express-validator"
import { validateField } from "./validate-fields.js"
import { handleErrors } from "./handle-errors.js"
import { validateJWT } from "./validate-jwt.js"
import { hasRoles } from "./validate-roles.js"

export const makeDepositValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("destinationAccount")
        .notEmpty().withMessage("Destination account is required")
        .isString().withMessage("Destination account must be a string"),
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 }).withMessage("Amount must be a number greater than 0"),
    validateField,
    handleErrors
];

export const makeTransferValidator = [
    validateJWT,
    hasRoles("CLIENT_ROLE"),
    param("originAccount")
        .notEmpty().withMessage("Origin account is required")
        .isString().withMessage("Origin account must be a string"),
    body("destinationAccount")
        .notEmpty().withMessage("Destination account is required")
        .isString().withMessage("Destination account must be a string"),
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    validateField,
    handleErrors,
];

export const updateDepositValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("mid")
        .notEmpty().withMessage("Movement ID is required")
        .isMongoId().withMessage("Invalid movement ID"),
    body("newAmount")
        .notEmpty().withMessage("New amount is required")
        .isFloat({ gt: 0 }).withMessage("New amount must be greater than 0"),
    validateField,
    handleErrors,
];

export const revertDepositValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("mid")
        .notEmpty().withMessage("Movement ID is required")
        .isMongoId().withMessage("Invalid movement ID"),
    validateField,
    handleErrors,
];

export const getAccountMovementsValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    param("aid")
        .notEmpty().withMessage("Account ID is required")
        .isMongoId().withMessage("Invalid account ID"),
    validateField,
    handleErrors,
];

export const getTopMovementsValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE")
];

export const getMyRecentMovementsValidator = [
    validateJWT,
    hasRoles("CLIENT_ROLE"),
    param("accountNumber")
        .notEmpty().withMessage("Account is required")
];

export const withdrawalValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    body("accountNumber")
        .notEmpty().withMessage("Account number is required")
        .isString().withMessage("Account number must be a string"),
    body("amount")
        .notEmpty().withMessage("Amount is required")
        .isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    validateField,
    handleErrors
]

export const validateGetAllMovements = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("limit")
        .optional()
        .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    param("from")
        .optional()
        .isInt({ min: 0 }).withMessage("From must be a non-negative integer"),
    validateField,
    handleErrors    
];

export const validateGetUserMovements = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    param("limit")
        .optional()
        .isInt({ min: 1 }).withMessage("Limit must be a positive integer"),
    param("from")
        .optional()
        .isInt({ min: 0 }).withMessage("From must be a non-negative integer"),
    validateField,
    handleErrors
];

export const getMovementsByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("mid")
        .notEmpty().withMessage("Movement ID is required")
        .isMongoId().withMessage("Invalid movement ID"),
    validateField,
    handleErrors
];