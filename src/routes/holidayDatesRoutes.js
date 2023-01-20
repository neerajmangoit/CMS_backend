import { Router } from "express";
import { getAllHolidayDatess, getHolidayDates, create, update, deletedHolidayDates } from "../controllers/holidayDatesController";

var holidaydatesRouter = Router();

holidaydatesRouter.get("", getAllHolidayDatess);

holidaydatesRouter.get("/:id", getHolidayDates);

holidaydatesRouter.post("/", create);

holidaydatesRouter.put("/:id", update);

holidaydatesRouter.delete("/:id", deletedHolidayDates);

export default holidaydatesRouter;
