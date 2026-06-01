import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .min(1, { message: "Email is required" }),

    password: z
        .string()
        .min(4, { message: "Password must be at least 4 characters long" })
});

export const signupSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(1, { message: "Full name is required" }),

    birthDate: z
        .string()
        .min(1, { message: "Birth date is required" })
        .refine((dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime());
        }, { message: "Invalid birth date format" })
        .refine((dateString) => {
            const today = new Date();
            const birthDate = new Date(dateString);

            // Calculate age
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDifference = today.getMonth() - birthDate.getMonth();

            if (
                monthDifference < 0 ||
                (monthDifference === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            return age >= 13 && age <= 120;
        }, { message: "You must be at least 13 years old" }),

    gender: z
        .string()
        .min(1, { message: "Please select a gender" }),

    email: z
        .email({ message: "Invalid email address" })
        .trim()
        .min(1, { message: "Email is required" }),

    password: z
        .string()
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .min(8, { message: "Password must be at least 8 characters long" })

});

// TypeScript type inference from the schema
export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;