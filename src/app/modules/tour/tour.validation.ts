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
    slug: z.string(),
    description: z.string(),
    location: z.string(),
    costFrom: z.number(),
    startDate: z.string(),
    endDate: z.string(),
    tourType: z.string(),
    included: z.array(z.string()),
    excluded: z.array(z.string()),
    amenities: z.array(z.string()),
    tourPlan: z.array(z.string()),
    maxGuests: z.number(),
    minAge: z.number(),
    division: z.string()
  }
);