import {Router} from 'express';
import { createUser, getUsers, getUserById, updateUserById, deleteUserClient, updateUser, updateUserPassword, deleteUserAdmin, updateUserAdmin, updateRole, getUserLogged} from './user.controller.js';
import { createUserValidator, listUsersValidator, getUserByIdValidator, updateUserAdminValidator, 
    deleteUserValidatorClient, updateUserValidator, updatePasswordValidator, deleteUserValidatorAdmin, updateUserValidatorAdmin, validateUpdateRole, getRoleValidator} from '../middlewares/user-validator.js';

const router = Router();

router.post('/createUser', createUserValidator, createUser);

router.get('/', listUsersValidator, getUsers);

router.get('/findUser/:uid', getUserByIdValidator, getUserById);

router.put('/updateUserById/:uid', updateUserAdminValidator, updateUserById);

router.delete("/deleteUserClient", deleteUserValidatorClient, deleteUserClient);

router.delete("/deleteUserAdmin/:uid", deleteUserValidatorAdmin, deleteUserAdmin);

router.put('/updateUser', updateUserValidator, updateUser);

router.put("/updateUserAdmin/:uid", updateUserValidatorAdmin, updateUserAdmin);

router.patch('/updatePassword', updatePasswordValidator, updateUserPassword);

router.patch("/updateRole/:uid", validateUpdateRole, updateRole);

router.get("/getUser", getRoleValidator, getUserLogged)

export default router;