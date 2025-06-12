import { param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const voucherPDFValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
    param("mid")
        .notEmpty().withMessage("Movement ID is required")
        .isMongoId().withMessage("Invalid movement ID"),
    validateField,
    handleErrors,
];

export const movementsCSVValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    handleErrors,
];
