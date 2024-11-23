import { Admin, Prisma, PrismaClient, UserStatus } from "@prisma/client";
import { adminSearchableFields } from "./admin.constant";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../sharred/prisma";
import { TAdminFilterRequest } from "./admin.interface";
import { TPaginationOptions } from "../../interfaces/pagination";

const getAllAdminsFromDB = async (
  params: TAdminFilterRequest,
  options: TPaginationOptions
) => {
  const { searchTerm, ...filterData } = params;
  const { limit, page, sortBy, sortOrder, skip } =
    paginationHelper.calculatePagination(options);

  const andConditions: Prisma.AdminWhereInput[] = [];

  if (params?.searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => {
        // console.log("field", field);
        return {
          [field]: {
            contains: params?.searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  //   adminSearchableFields.map((item) => console.log(item));

  if (Object.keys.length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  andConditions.push({
    isDeleted: false,
  });
  //   console.dir(andConditions, { depth: "infinity" });

  const whereConditions: Prisma.AdminWhereInput = { AND: andConditions };
  //   console.log(whereConditions);

  const result = await prisma.admin.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [sortBy]: sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });
  console.log(result);

  const total = await prisma.admin.count({
    where: whereConditions,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getAdminById = async (id: string): Promise<Admin | null> => {
  const result = await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });
  return result;
};

const updateAdminIntoDB = async (
  id: string,
  updatedData: Partial<Admin>
): Promise<Admin | null> => {
  //   await prisma.admin.findUniqueOrThrow({
  //     where: { id },
  //   });
  console.log(
    await prisma.admin.findUniqueOrThrow({
      where: { id, isDeleted: false },
    })
  );
  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: updatedData,
  });
  return result;
};

const deleteAdminFromDB = async (id: string): Promise<Admin | null> => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.delete({
      where: { id },
    });

    await tx.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });
    return adminDeletedData;
  });
  return result;
};

const softDeleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.$transaction(async (tx) => {
    const adminDeletedData = await tx.admin.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await tx.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return adminDeletedData;
  });
  return result;
};

export const AdminService = {
  getAllAdminsFromDB,
  getAdminById,
  updateAdminIntoDB,
  deleteAdminFromDB,
  softDeleteFromDB,
};
