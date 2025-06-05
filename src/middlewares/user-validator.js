import { body } from "express-validator";
import { validateField } from "./validate-fields.js";
import { handleErrors } from "./handle-errors.js";

export const validatorLogin = [
    body("emailOrUsername")
        .notEmpty().withMessage("Email or Username is mandatory"), 
    body("password")
        .notEmpty().withMessage("The password is required")
        .isStrongPassword({
            minLength: 6,
            minUppercase: 1
        }).withMessage("The password must contain at least 6 characters"),
    validateField,
    handleErrors
];