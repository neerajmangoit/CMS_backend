import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import  BannerController from '../controllers/bannerController';
let bannerController = new BannerController();

router.post("/addBanner", multer.single('banner'), bannerController.addBanner.bind(bannerController));

router.get("/bannerList", bannerController.bannerList.bind(bannerController));

router.get("/bannerById/:id", bannerController.bannerById.bind(bannerController));

router.delete("/bannerDelete/:id", bannerController.bannerDelete.bind(bannerController));

router.put("/bannerUpdate/:id", multer.single('banner'), bannerController.bannerUpdate.bind(bannerController));

export default router;