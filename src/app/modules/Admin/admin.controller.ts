import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import pick from "../../../sharred/pick";
import { adminFilterableFields } from "./admin.constant";
import sendResponse from "../../../sharred/sendResponse";
import catchAsync from "../../../sharred/catchAsync";

const getAllAdminsFromDB: RequestHandler = catchAsync(async (req, res) => {
  const filter = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  console.log("options", options);
  const result = await AdminService.getAllAdminsFromDB(filter, options);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Admin data fetched successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

const getAdminById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  console.log(id);
  //   console.log(req.query);
  try {
    const result = await AdminService.getAdminById(id);
    console.log(result);
    // res.status(200).json({
    //   success: true,
    //   message: "Admin data fetched by ID",
    //   data: result,
    // });
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data fetched by ID",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.updateAdminIntoDB(id, req.body);
    console.log("result", result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data updated successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    const result = await AdminService.deleteAdminFromDB(id);
    console.log("result", result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};
const softAdminDelete = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  try {
    const result = await AdminService.softDeleteFromDB(id);
    console.log("result", result);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Admin data deleted successfully",
      data: result,
    });
  } catch (err: any) {
    next(err);
  }
};

export const AdminController = {
  getAllAdminsFromDB,
  getAdminById,
  updateAdmin,
  deleteAdmin,
  softAdminDelete,
};
