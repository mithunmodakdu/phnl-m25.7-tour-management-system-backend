import z from "zod";
import { EIsActive, ERole } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, {
      message: "Name is too short. It must have minimum 2 characters.",
    })
    .max(50, {
      message: "Name is too long. It must have maximum 50 characters.",
    }),
  email: z.string().email(),
  password: z
    .string({ message: "Password must be string" })
    .min(8, { message: "Password must have at least 8 characters." })
    .regex(/^(?=.*[A-Z])/, {
      message: "Password must have at least one uppercase letter",
    })
    .regex(/^(?=.*[@#$%!*])/, {
      message: "Password must have at least one special character",
    })
    .regex(/^(?=.*\d)/, { message: "Password must have at least one digit" }),
  phone: z
    .string({ message: "Phone number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh.   Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(50, { message: "Address can not exceed 200 characters" })
    .optional(),
});


export const updateUserZodSchema = z.object({
  name: z
    .string({ message: "Name must be string" })
    .min(2, {
      message: "Name is too short. It must have minimum 2 characters.",
    })
    .max(50, {
      message: "Name is too long. It must have maximum 50 characters.",
    })
    .optional(),
  phone: z
    .string({ message: "Phone number must be string" })
    .regex(/^(?:\+8801\d{9}|01\d{9})$/, {
      message:
        "Phone number must be valid for Bangladesh.   Format: +8801XXXXXXXXX or 01XXXXXXXXX",
    })
    .optional(),
  address: z
    .string({ message: "Address must be string" })
    .max(50, { message: "Address can not exceed 200 characters" })
    .optional(),
  role: z
    .enum(Object.values(ERole) as [string])
    .optional(),
  isActive: z
    .enum(Object.values(EIsActive) as [string])
    .optional(),
  isDeleted: z
    .boolean({invalid_type_error: "isDeleted must be true or false"})
    .optional(),
  isVerified: z
    .boolean({invalid_type_error: "isVerified must be true or false"})
    .optional(),
  
});
