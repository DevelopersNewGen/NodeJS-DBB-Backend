import { body, param } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";
import { validateJWT } from "./validate-jwt.js";
import { hasRoles } from "./validate-roles.js";
import { emailExists, validateMonthlyIncome, usernameExists, dpiExists, userExists, isClient} from "../helpers/db-validator.js";

export const validatorLogin = [
    body("emailOrUsername")
        .notEmpty().withMessage("Email or Username is mandatory"), 
    body("password")
        .notEmpty().withMessage("The password is required"),
    validateField,
    handleErrors
];

export const createUserValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), 
    body("name")
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 50 }).withMessage("Name cannot exceed 35 characters"),
    body("username")
        .notEmpty().withMessage("Username is required")
        .isLength({ max: 20 }).withMessage("Username cannot exceed 20 characters").custom(usernameExists),
    body("dpi")
        .notEmpty().withMessage("DPI is required")
        .isLength({ min: 13, max: 13 }).withMessage("DPI must be exactly 13 characters").custom(dpiExists),
    body("address")
        .notEmpty().withMessage("Address is required"),
    body("cellphone")
        .notEmpty().withMessage("Cellphone is required")
        .isMobilePhone().withMessage("Cellphone must be a valid phone number"),
    body("email")
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid").custom(emailExists),
    body("password").notEmpty().withMessage("The password is required"),
    body("password").isStrongPassword({
        minLength: 8,
        minLowerCase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }).withMessage("The password must contain at least 8 characters"),
    body("jobName")
        .notEmpty().withMessage("Job name is required"),
    body("monthlyIncome")
        .notEmpty().withMessage("Monthly income is required")
        .isNumeric().withMessage("Monthly income must be a number").custom(validateMonthlyIncome),
    validateField, 
    handleErrors 
];

export const listUsersValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), 
    validateField, 
    handleErrors
];

export const getUserByIdValidator = [
    validateJWT,
    hasRoles("ADMIN_ROLE"), 
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(userExists),
    validateField, 
    handleErrors
];

export const updateUserValidator = [
    validateJWT,
    body("name")
        .optional()  
        .notEmpty().withMessage("Name is required")
        .isLength({ max: 50 }).withMessage("Name cannot exceed 50 characters"),
     body("username")
        .optional()  
        .notEmpty().withMessage("Username is required")
        .isLength({ max: 20 }).withMessage("Username cannot exceed 20 characters"),

    body("address")
        .optional()  
        .notEmpty().withMessage("Address is required"),

    body("cellphone")
        .optional()  
        .notEmpty().withMessage("Cellphone is required")
        .isMobilePhone().withMessage("Cellphone must be a valid phone number"),

    body("email")
        .optional()  
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),

    body("jobName")
        .optional()  
        .notEmpty().withMessage("Job name is required"),

    body("monthlyIncome")
        .optional()  
        .notEmpty().withMessage("Monthly income is required")
        .isNumeric().withMessage("Monthly income must be a number")
        .custom(validateMonthlyIncome),

    validateField,  
    handleErrors  
];

export const updateUserValidatorAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(isClient),
    param("uid").custom(userExists),
    body("username")
        .optional()  
        .notEmpty().withMessage("Username is required")
        .isLength({ max: 20 }).withMessage("Username cannot exceed 20 characters"),
    body("address")
        .optional()  
        .notEmpty().withMessage("Address is required"),
    body("cellphone")
        .optional()  
        .notEmpty().withMessage("Cellphone is required")
        .isMobilePhone().withMessage("Cellphone must be a valid phone number"),
    body("email")
        .optional()  
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email must be valid"),
    body("jobName")
        .optional()  
        .notEmpty().withMessage("Job name is required"),

    body("monthlyIncome")
        .optional()  
        .notEmpty().withMessage("Monthly income is required")
        .isNumeric().withMessage("Monthly income must be a number")
        .custom(validateMonthlyIncome),
    validateField,
    handleErrors
];
    
export const updatePasswordValidator = [
    validateJWT,
    body("contraActual")
        .notEmpty().withMessage("La contraseña actual es requerida"),
    body("nuevaContra").notEmpty().withMessage("La nueva contraseña es requerida").notEmpty().withMessage("New password is required")
        .isStrongPassword({
            minLength: 8,
            minLowerCase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        }).withMessage("La nueva contraseña debe contener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos"),
    body("confirmacionContra").notEmpty().withMessage("La confrimacion es requerida"),
    validateField, 
    handleErrors
];

export const deleteUserValidatorAdmin = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    param("uid").custom(isClient),
    param("uid").custom(userExists),
    validateField,
    handleErrors
];

export const validateUpdateRole = [
    validateJWT,
    hasRoles("ADMIN_ROLE"),
    param("uid").isMongoId().withMessage("The id is not valid"),
    body("newRole").notEmpty().withMessage("The role is required"),
    body("newRole").isIn(["ADMIN_ROLE", "CLIENT_ROLE"]).withMessage("The role is not valid"),
    validateField,
    handleErrors    
]

export const getRoleValidator = [
    validateJWT,
    validateField,
    handleErrors
]

export const favoriteAccountValidator = [
    validateJWT,
    body("accountNumber")
        .notEmpty().withMessage("Account number is required"),
    body("alias")
        .notEmpty().withMessage("Alias is required"),
    validateField,
    handleErrors
];