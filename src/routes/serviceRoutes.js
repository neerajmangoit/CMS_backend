import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import ServiceController from '../controllers/serviceController';
let serviceController = new ServiceController();

router.post("/addService", multer.single('image'), serviceController.addService.bind(serviceController));

router.get("/serviceList", serviceController.serviceList.bind(serviceController));

router.get("/service-limit-list", serviceController.serviceLimitList.bind(serviceController));

router.get("/serviceById/:id", serviceController.serviceById.bind(serviceController));

router.get("/serviceBySlug/:slug", serviceController.serviceBySlug.bind(serviceController));


router.delete("/serviceDelete/:id", serviceController.serviceDelete.bind(serviceController));

router.put("/serviceUpdate/:id", multer.single('image'), serviceController.serviceUpdate.bind(serviceController));

export default router;