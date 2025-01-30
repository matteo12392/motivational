import { z } from "zod"

export const addUserFormSchema = z.object({
    language: z.string({
        required_error: "Please select a language.",
    }),
})

// Union of schemas
export const formSchema = z.union([addUserFormSchema, addUserFormSchema]);

// Extract TypeScript type
export type FormSchemaType = z.infer<typeof formSchema>;