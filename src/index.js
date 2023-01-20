import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import env from "dotenv";
import userRoutes from "../src/routes/userRoutes";
import pagesRoutes from "../src/routes/pagesRoutes";
import contactAdminRoutes from "../src/routes/contactRoutes";
import reviewsRoute from "../src/routes/reviewsRoutes";
import bannerRoute from "../src/routes/bannerRoutes";
import infoRoute from '../src/routes/infoRoutes';
import ctaRoute from '../src/routes/ctaRoutes';
import scheduleRouter from './routes/scheduleRoutes';
import holidayDatesRouter from './routes/holidayDatesRoutes';
import serviceRoute from '../src/routes/serviceRoutes';
import appointmentRoute from '../src/routes/appointmentRoutes';
import logoRoute from '../src/routes/logoRoutes';
import contentLimitRoute from '../src/routes/content-limitRoutes';
import pateintRoute from '../src/routes/pateintRoutes';
import webhook from '../src/routes/recieveMail';
import notification from '../src/routes/notificationRoutes';


const app = express();
const port = process.env.PORT || 8005
env.config();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/uploads", express.static("./uploads"));

// To the router
app.use("/api", userRoutes);
app.use("/api", pagesRoutes);
app.use("/api", contactAdminRoutes);
app.use("/api", reviewsRoute);
app.use("/api", bannerRoute);
app.use("/api", infoRoute);
app.use("/api", ctaRoute);
app.use("/api/schedule", scheduleRouter);
app.use("/api/holiday-dates", holidayDatesRouter);
app.use("/api", serviceRoute);
app.use("/api", appointmentRoute);
app.use("/api", logoRoute);
app.use("/api", contentLimitRoute);
app.use("/api", pateintRoute);
app.use("/api", webhook);
app.use("/mail", notification);


// Handling Errors
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
});

app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
