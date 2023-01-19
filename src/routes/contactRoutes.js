import { Router } from "express";
const router = Router();
import  ContactController from '../controllers/contactController';
let contactController = new ContactController();
router.post("/contact-admin", contactController.contact_admin.bind(contactController));

export default router;