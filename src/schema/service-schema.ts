import { z } from "zod";

export const serviceCategoryEnum = [
  "venue",
  "catering",
  "photography",
  "entertainment",
  "decor",
  "other",
] as const;

export type ServiceCategory = (typeof serviceCategoryEnum)[number];

export const serviceSchema = z.object({
  name: z.string().min(1, "Please provide service name").trim(),
  description: z.string().min(1, "Please provide service description"),
  basePrice: z.number().min(0, "Price cannot be negative"),
  category: z.enum(serviceCategoryEnum, {
    required_error: "Please provide service category",
  }),
  imageUrl: z.string().optional(),
});

export type ServiceRegistration = z.infer<typeof serviceSchema>;

export interface ServiceData {
  _id: string;
  name: string;
  description: string;
  basePrice: number;
  category: ServiceCategory;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListServiceResponse {
  success: boolean;
  count: number;
  data: ServiceData[];
} 

export interface ServiceResponse {
  success: boolean;
  data: ServiceData;
}

