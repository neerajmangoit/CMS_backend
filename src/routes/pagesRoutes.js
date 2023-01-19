import { Router } from "express";
const router = Router();
import multer from '../core/imageUpload';
import  PagesController from '../controllers/pagesControllers';
let pageController = new PagesController();
router.post("/addpages", pageController.addpage.bind(pageController));

router.get("/pagesList", pageController.pageList.bind(pageController));

router.get("/pagesById/:id", pageController.pageById.bind(pageController));

router.delete("/pagesDelete/:id", pageController.pageDelete.bind(pageController));

router.put("/pagesUpdate/:id", pageController.pageUpdate.bind(pageController));

router.get("/pagesBySlug/:slug", pageController.pageBySlug.bind(pageController));

export default router;