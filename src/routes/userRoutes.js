import { Router } from 'express';
const router = Router();
import UserController from '../controllers/userController';
import auth from '../middleware/authMiddleware';
import multer from '../core/imageUpload'

let userController = new UserController();
router.post('/register', userController.userRegistration.bind(userController));
router.post('/login', userController.userLogin.bind(userController));
router.get('/userList', userController.get_User.bind(userController));
router.get('/userById/:id', userController.get_User_By_id.bind(userController));
router.put('/userUpdate/:id', multer.single('profile'), userController.update_User.bind(userController));
router.delete('/userDelete/:id', userController.delete_User.bind(userController));

export default router;