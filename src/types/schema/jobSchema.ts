import { z } from "zod";

export const jobSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(50, "Title must be at most 50 character"),
    job_description: z.string().min(100, "Description must be at least 100 characters"),
    category: z.string().nonempty("Please select category"),
    price: z.number().min(0, "Price must be a positive number"),
});

export type jobSchemaType = z.infer<typeof jobSchema>;