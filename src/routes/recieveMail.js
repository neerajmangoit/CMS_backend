import { Router } from "express";
const router = Router();
import  RecieveMailController from '../controllers/mailRecievecontroller';

router.get("/webhook", RecieveMailController);

export default router;