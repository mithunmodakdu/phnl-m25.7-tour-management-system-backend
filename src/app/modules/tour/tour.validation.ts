import z from "zod";

export const createTourTypeZodSchema = z.object(
  {
    name: z.string()
  }
);
export const updateTourTypeZodSchema = z.object(
  {
    name: z.string()
  }
);

export const createTourZodSchema = z.object(
  {
    title: z.string(),
    // slug: z.string(),
    description: z.string(),
    location: z.string(),
    costFrom: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    tourType: z.string(),
    included: z.array(z.string()),
    excluded: z.array(z.string()),
    amenities: z.array(z.string()),
    tourPlan: z.array(z.string()),
    maxGuests: z.number(),
    minAge: z.number(),
    division: z.string(),
    deleteImages: z.array(z.string()).optional()
  }
);

export const updateTourZodSchema = z.object(
  {
    title: z.string().optional(),
    // slug: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    costFrom: z.number().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    tourType: z.string().optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    included: z.array(z.string()).optional(),
    excluded: z.array(z.string()).optional(),
    amenities: z.array(z.string()).optional(),
    tourPlan: z.array(z.string()).optional(),
    maxGuests: z.number().optional(),
    minAge: z.number().optional(),
    division: z.string().optional(),
    deleteImages: z.array(z.string()).optional(),
  }
);