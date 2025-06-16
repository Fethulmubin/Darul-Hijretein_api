import express from 'express';
import { Signup, Login } from '../controllers/userController';

const userRoute = express.Router();

userRoute.post('/register', Signup);
userRoute.post('/login', Login);

export default userRoute;