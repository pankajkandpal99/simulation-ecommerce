import { z } from "zod";

export const cloudinaryFileSchema = z.object({
  fieldname: z.string(),
  filename: z.string(),
  publicUrl: z.string(),
  cloudinaryId: z.string(),
  resourceType: z.string(),
  // Add other Cloudinary-specific fields if needed
});
