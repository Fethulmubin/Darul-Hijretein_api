import express from 'express';
import { Signup, Login } from '../controllers/userController';
import { body, validationResult } from 'express-validator';
import { validateLogin, validateSignup } from '../middleware/inputValidator';
import { validateRequest } from '../middleware/validatorMiddleware';
// import { validateLogin, validateSignup } from '../middleware/inputValidator';

const userRoute = express.Router();

userRoute.post('/register', validateSignup, validateRequest , Signup);
userRoute.post('/login',validateLogin, validateRequest,  Login);

export default userRoute;