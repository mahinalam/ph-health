import express from "express";
import { UserRoutes } from "../modules/User/user.route";
import { AdminRoutes } from "../modules/Admin/admin.route";
import { AuthRoute } from "../modules/Auth/auth.route";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/user",
    router: UserRoutes,
  },
  {
    path: "/admin",
    router: AdminRoutes,
  },
  {
    path: "/auth",
    router: AuthRoute,
  },
];

moduleRoutes.forEach((route: any) => router.use(route.path, route.router));

export default router;
