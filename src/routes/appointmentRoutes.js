
import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import AppointmentController from '../controllers/appointmentController';
let appointmentController = new AppointmentController();

router.post("/addappointment", appointmentController.addappointment.bind(appointmentController));

router.get("/appointmentList", appointmentController.appointmentList.bind(appointmentController));

router.get("/appointmentById/:id", appointmentController.appointmentById.bind(appointmentController));

router.put("/appointmentUpdate/:id", appointmentController.appointmentUpdate.bind(appointmentController));

router.delete("/appointmentDelete/:id", appointmentController.appointmentDelete.bind(appointmentController));

export default router; 