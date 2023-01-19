import { Router } from "express";
const router = Router();
import  ReviewController from '../controllers/reviewsController';
let reviewController = new ReviewController();

router.post("/add-reviews", reviewController.addReview.bind(reviewController));

router.post("/reviews-to-display", reviewController.reviewToDisplay.bind(reviewController));

router.get("/get-reviews", reviewController.getreview.bind(reviewController));

router.get("/reviews-by-id/:id", reviewController.reviewById.bind(reviewController));

router.get("/reviewByStatus", reviewController.reviewByStatus.bind(reviewController));



export default router;