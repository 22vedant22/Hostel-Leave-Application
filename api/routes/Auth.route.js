import express from 'express';
import { ForgotPassword, GoogleLogin, Logout , Register, ResetPassword } from '../controllers/Auth.controller.js';
import { Login } from '../controllers/Auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';

const AuthRoute = express.Router();

AuthRoute.post('/register', Register);
AuthRoute.post('/login', Login);
AuthRoute.post('/google-login',GoogleLogin)
AuthRoute.get('/logout',authenticate,Logout);
AuthRoute.post("/forgot-password", ForgotPassword);
AuthRoute.post("/reset-password/:token", ResetPassword);
export default AuthRoute;
