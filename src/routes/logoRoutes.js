import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import  LogoController from '../controllers/logoController';
let logoController = new LogoController();

router.post("/add-logo", multer.single('logo_image'), logoController.addLogo.bind(logoController));

router.get("/logoList", logoController.logoList.bind(logoController));

router.get("/logoById/:id", logoController.logoById.bind(logoController));

router.delete("/logoDelete/:id", logoController.logoDelete.bind(logoController));

router.put("/logoUpdate/:id", multer.single('image'), logoController.logoUpdate.bind(logoController));

export default router;