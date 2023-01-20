import { Router } from "express";
const router = Router();
import  PateintController from '../controllers/pateintController';
import multer from '../core/imageUpload';

let pateintController = new PateintController();

router.post("/addpateint", pateintController.addPateint.bind(pateintController));

router.get("/pateintList", pateintController.pateintList.bind(pateintController));

router.get("/pateintById/:id", pateintController.pateintById.bind(pateintController));

router.get("/pateintDeatilsById/:id", pateintController.pateintDteailsById.bind(pateintController));

router.delete("/pateintDelete/:id", pateintController.pateintDelete.bind(pateintController));

router.put("/pateintUpdate/:id", pateintController.pateintUpdate.bind(pateintController));

router.get("/patient-limit-list/:limit", pateintController.pateintLimitList.bind(pateintController));

router.post("/sendMessage", pateintController.sendMessageToPateint.bind(pateintController));

router.post("/importPateint",multer.single('pateint'), pateintController.importPateint.bind(pateintController));


export default router;