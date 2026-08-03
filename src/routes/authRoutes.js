import { Router } from 'express';
import { authController } from '../controllers/authController.js';

const authRouter = Router();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);
authRouter.post('/refresh', authController.refreshToken);
authRouter.get('/me', authController.getMe);
authRouter.patch('/me', authController.updateMe);

export default authRouter;
