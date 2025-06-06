import {Router} from 'express';
import { createUser, listUsers, getUserById, updateUserById, deleteUser, updateUser, updateUserPassword} from './user.controller.js';
import { createUserValidator, listUsersValidator, getUserByIdValidator, updateUserAdminValidator, 
    deleteUserValidator, updateUserValidator, updatePasswordValidator} from '../middlewares/user-validator.js';

const router = Router();

router.post('/createUser', createUserValidator, createUser);

router.get('/listUsers', listUsersValidator, listUsers);

router.get('/getUserById/:uid', getUserByIdValidator, getUserById);

router.put('/updateUserById/:uid', updateUserAdminValidator, updateUserById);

router.delete('/deleteUser/:uid', deleteUserValidator, deleteUser);

router.put('/updateUser', updateUserValidator, updateUser);

router.patch('/updateUserPassword', updatePasswordValidator, updateUserPassword);

export default router;