import z from "zod";

export const createDivisionZodSchema = z.object(
  {
    name: z
      .string({message: "Division Name must be string"})
      .min(2, {message: "Division name must be of at least 2 characters."})
      .max(50, {message: "Division name must be of maximum 50 characters."}),
    // slug: z
    //   .string({message: "Division slug must be string."})
    //   .min(2, {message: "Division slug must be of at least 2 characters."})
    //   .max(50, {message:"Division slug must be of maximum 50 characters." }),
    thumbnail: z
      .string({message: "Thumbnail image link must be string"})
      .optional(),
    description: z
      .string({message: "Division description must be string"})
      .optional()

  }
)

export const updateDivisionZodSchema = z.object(
  {
    name: z
      .string({message: "Division Name must be string"})
      .min(2, {message: "Division name must be of at least 2 characters."})
      .max(50, {message: "Division name must be of maximum 50 characters."})
      .optional(),
    // slug: z
    //   .string({message: "Division slug must be string."})
    //   .min(2, {message: "Division slug must be of at least 2 characters."})
    //   .max(50, {message:"Division slug must be of maximum 50 characters." })
    //   .optional(),
    thumbnail: z
      .string({message: "Thumbnail image link must be string"})
      .optional(),
    description: z
      .string({message: "Division description must be string"})
      .optional()

  }
)