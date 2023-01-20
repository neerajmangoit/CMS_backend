import { Router } from "express";
const router = Router();
import notificationController from '../controllers/notificationController';

router.post("/store-mail", notificationController.storeMail);

router.get("/get-mail", notificationController.getAllMail);

router.get("/get-config", notificationController.getConfig);

router.put("/set-config", notificationController.setConfig);

router.delete("/delete-config", notificationController.deleteConfig);

router.post("/create-config", notificationController.createconfig);

export default router;