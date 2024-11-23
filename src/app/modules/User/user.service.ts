import { PrismaClient, UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";
import prisma from "../../../sharred/prisma";

const createAdmin = async (data: any) => {
  console.log(data);

  const hashedPassword: string = await bcrypt.hash(data.password, 12);

  console.log(hashedPassword);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  // using sequental transaction
  const [, createAdmin] = await prisma.$transaction([
    prisma.user.create({
      data: userData,
    }),
    prisma.admin.create({
      data: data.admin,
    }),
  ]);

  return createAdmin;

  //   const result = await prisma.$transaction(async (tx) => {
  //     await tx.user.create({
  //       data: userData,
  //     });

  //     const createdAdmin = await tx.admin.create({
  //       data: data.admin,
  //     });

  //     return createdAdmin;
  //   });

  //   return result;
};

export const UserService = {
  createAdmin,
};
