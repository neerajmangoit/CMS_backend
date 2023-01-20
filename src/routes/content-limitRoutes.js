import { Router } from "express";
const router = Router();
import  ContentLimitController from '../controllers/content-limitController';
let contentLimitController = new ContentLimitController();

router.post("/addcontentLimit", contentLimitController.addContentLimit.bind(contentLimitController));

router.get("/contentlimitList", contentLimitController.contentlimitList.bind(contentLimitController));

router.get("/contentlimitById/:id", contentLimitController.contentlimitById.bind(contentLimitController));

router.delete("/contentlimitDelete/:id", contentLimitController.contentlimitDelete.bind(contentLimitController));

router.put("/contentlimitUpdate/:id", contentLimitController.contentlimitUpdate.bind(contentLimitController));

export default router;