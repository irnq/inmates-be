import { Router } from 'express';
import UserController from '../controllers/user-controller';
import { body } from 'express-validator';
import { authMiddleware } from '../middlewares/auth-middleware';

const router = Router();
const userController = new UserController();

router.post(
  '/registration',
  body('email').isEmail(),
  body('password').isLength({ min: 5, max: 32 }),
  body('nickname').isLength({ min: 2, max: 24 }),
  userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);

export default router;
