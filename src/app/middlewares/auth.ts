import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelper";
import config from "../../config";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(401, "You are no authorized");
      }

      const verifyUser = jwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      if (roles.length > 0 || !roles.includes(verifyUser?.role)) {
        throw new ApiError(403, "Forbidden access");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
