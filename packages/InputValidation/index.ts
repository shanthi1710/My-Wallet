import { z } from "zod";

export const signinValidation = z.object({
    email: z.string().email("Invalid email").nonempty("Email required"),
    name: z.string().nonempty("Name required"),
    number: z.string()
        .length(10, "Number must be 10 digits")
        .regex(/^\d+$/, "Digits only")
        .nonempty("Number required"),
    password: z.string()
        .min(6, "Password at least 6 chars")
        .nonempty("Password required")
}).superRefine((data, ctx) => {
    if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
            path: ['password'],
            message: "At least one uppercase",
            code: "custom"
        });
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(data.password)) {
        ctx.addIssue({
            path: ['password'],
            message: "At least one special char",
            code: "custom"
        });
    }
});
