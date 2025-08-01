import { z } from "zod";

export const profileSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be at most 20 character"),
    title: z.string().min(5, "Title must be at least 5 characters").max(30, "Title must be at most 30 character"),
    bio: z.string().max(50, "Bio must be at most 50 characters"),
    about_me: z.string().max(700, "About me must not be greater than 700 characters")
});

export type ProfileSchemaType = z.infer<typeof profileSchema>;