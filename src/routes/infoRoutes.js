import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import  InfoController from '../controllers/infoController';
let infoController = new InfoController();

router.post("/addInfo", multer.single('image'), infoController.addInfo.bind(infoController));

router.get("/infoList", infoController.infoList.bind(infoController));

router.get("/infoById/:id", infoController.infoById.bind(infoController));

router.get("/info-limit-list", infoController.infoLimitList.bind(infoController));

router.delete("/infoDelete/:id", infoController.infoDelete.bind(infoController));

router.put("/infoUpdate/:id", multer.single('image'), infoController.infoUpdate.bind(infoController));

export default router;