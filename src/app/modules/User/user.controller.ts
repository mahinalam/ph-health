import { Request, Response } from "express";
import { UserService } from "./user.service";

const createAdmin = async (req: Request, res: Response) => {
  //   console.log(req.body);
  try {
    const result = await UserService.createAdmin(req.body);
    res.status(200).json({
      success: true,
      message: "Admin created successfully.",
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.name || "Something went wrong!",
      error: err,
    });
    console.log(err);
  }
};

export const UserController = {
  createAdmin,
};
