import { z } from "zod";

export const gigSchema = z.object({
    title: z.string().min(10, "Title must be at least 10 characters").max(50, "Title must be at most 50 character"),
    gig_description: z.string().min(100, "Description must be at least 100 characters"),
    category: z.string().nonempty("Please select category"),
});

export type GigSchemaType = z.infer<typeof gigSchema>;