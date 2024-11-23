import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.route";
import { AdminRoutes } from "./app/modules/Admin/admin.route";
import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandlers";
import cookieParser from "cookie-parser";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1", router);

app.use(globalErrorHandler);

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND",
    error: {
      path: req.originalUrl,
      error: "Your requested path is not found.",
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "PH health care server...",
  });
});

export default app;
