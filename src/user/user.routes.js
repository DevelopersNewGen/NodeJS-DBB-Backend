import {Router} from 'express';
import { createUser } from './user.controller.js';
import { createUserValidator } from '../middlewares/user-validator.js';

const router = Router();

router.post('/createUser', createUserValidator, createUser);

export default router;