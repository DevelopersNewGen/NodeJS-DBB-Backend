import {Router} from 'express';
import { createUser, getUsers, getUserById, updateUser, updateUserPassword, deleteUserAdmin, updateUserAdmin, updateRole, getUserLogged} from './user.controller.js';
import { createUserValidator, listUsersValidator, getUserByIdValidator, 
    updateUserValidator, updatePasswordValidator, deleteUserValidatorAdmin, updateUserValidatorAdmin, validateUpdateRole, getRoleValidator} from '../middlewares/user-validator.js';

const router = Router();

router.post('/createUser', createUserValidator, createUser);

router.get('/', listUsersValidator, getUsers);

router.get('/findUser/:uid', getUserByIdValidator, getUserById);

router.delete("/deleteUserAdmin/:uid", deleteUserValidatorAdmin, deleteUserAdmin);

router.put('/updateUser', updateUserValidator, updateUser);

router.put("/updateUserAdmin/:uid", updateUserValidatorAdmin, updateUserAdmin);

router.patch('/updatePassword', updatePasswordValidator, updateUserPassword);

router.patch("/updateRole/:uid", validateUpdateRole, updateRole);

router.get("/getUser", getRoleValidator, getUserLogged)

export default router;