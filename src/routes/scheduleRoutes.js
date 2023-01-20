import { Router } from "express";
import { getAllSchedules, getSchedule, create, update, deletedSchedule } from "./../controllers/scheduleController";

var scheduleRouter = Router();

scheduleRouter.get("", getAllSchedules);

scheduleRouter.get("/:id", getSchedule);

scheduleRouter.post("/", create);

scheduleRouter.put("/:id", update);

scheduleRouter.delete("/:id", deletedSchedule);

export default scheduleRouter;
