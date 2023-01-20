
import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import  CtaController from '../controllers/ctaController';
let ctaController = new CtaController();

router.post("/addCta", multer.single('image'), ctaController.addCta.bind(ctaController));

router.get("/ctaList", ctaController.ctaList.bind(ctaController));

router.get("/ctaById/:id", ctaController.ctaById.bind(ctaController));

router.delete("/ctaDelete/:id", ctaController.ctaDelete.bind(ctaController));

router.put("/ctaUpdate/:id", multer.single('image'), ctaController.ctaUpdate.bind(ctaController));

export default router;