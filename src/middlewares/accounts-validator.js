import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";

export const createAccountValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE"),
  body("accountType")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["MONETARY", "SAVER", "OTHER"])
    .withMessage("Invalid account type"),
  body("balance")
    .optional()
    .isNumeric()
    .withMessage("Balance must be a number"),
  validateField,
  handleErrors,
];

export const listAccountsByUserValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
  param("uid")
    .notEmpty()
    .withMessage("User ID is required")
    .isMongoId()
    .withMessage("User ID must be a valid Mongo ID"),
  validateField,
  handleErrors,
];

export const getAccountByIdValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE", "CLIENT_ROLE"),
  param("aid")
    .notEmpty()
    .withMessage("Account ID is required")
    .isMongoId()
    .withMessage("Account ID must be a valid Mongo ID"),
  validateField,
  handleErrors,
];

export const getAccountRecentMovementsValidator = [
  validateJWT,
  hasRoles("ADMIN_ROLE"),
  validateField,
  handleErrors,
];