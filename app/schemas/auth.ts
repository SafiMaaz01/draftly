import z from "zod";

export const signUpSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").max(30, "Name must be at most 30 characters long"),
    email: z.email("Invalid email address").max(100, "Email must be at most 100 characters long"),
    password: z.string().min(8, "Password must be at least 8 characters long").max(30, "Password must be at most 30 characters long"),
});