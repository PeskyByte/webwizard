import { generateUploadButton } from "@uploadthing/react";
import { generateReactHelpers } from "@uploadthing/react";
import { generateUploadDropzone } from "@uploadthing/react";

import type { OurFileRouter } from "@/app/api/uploadthing/core";

export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

export const uploadButton = generateUploadButton<OurFileRouter>();

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
