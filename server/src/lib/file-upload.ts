import { Request } from "express";
import Busboy from "busboy";
import { v4 as uuidv4 } from "uuid";
import { logger } from "../utils/logger.js";
import {
  FileInfo,
  UploadOptions,
  UploadResult,
} from "../types/file-upload-types.js";
import { CloudinaryUploadService } from "../services/cloudinary-upload.service.js";
import path from "path";

const DEFAULT_OPTIONS: UploadOptions = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  destination: "uploads",
  useCloudinary: true,
  cloudinaryFolder: "gamehigame",
};

const generateUniqueFilename = (originalName: string): string => {
  const ext = path.extname(originalName);
  return `${uuidv4()}${ext}`;
};

const validateFile = (
  fileInfo: Omit<FileInfo, "destination" | "path" | "publicUrl">,
  options: UploadOptions
): void => {
  if (fileInfo.size > (options.maxFileSize || DEFAULT_OPTIONS.maxFileSize!)) {
    throw new Error(
      `File ${fileInfo.filename} exceeds maximum size of ${
        options.maxFileSize! / 1024 / 1024
      }MB`
    );
  }

  const allowedTypes =
    options.allowedMimeTypes || DEFAULT_OPTIONS.allowedMimeTypes!;
  if (!allowedTypes.includes(fileInfo.mimetype)) {
    throw new Error(
      `File type ${
        fileInfo.mimetype
      } is not allowed. Allowed types: ${allowedTypes.join(", ")}`
    );
  }
};

export const handleFileUpload = async (
  req: Request,
  options: Partial<UploadOptions> = {}
): Promise<UploadResult> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: mergedOptions.maxFileSize,
      },
    });

    const files: FileInfo[] = [];
    const fields: Record<string, any> = {};
    const filePromises: Promise<void>[] = []; // Track file processing promises

    busboy.on("file", async (fieldname, file, info) => {
      const { filename, encoding, mimeType } = info;
      const chunks: Buffer[] = [];

      const filePromise = new Promise<void>((fileResolve, fileReject) => {
        file.on("data", (chunk) => {
          chunks.push(chunk);
        });

        file.on("end", async () => {
          try {
            const buffer = Buffer.concat(chunks);
            const uniqueFilename = generateUniqueFilename(filename);

            const fileInfo: Omit<
              FileInfo,
              "destination" | "path" | "publicUrl"
            > = {
              fieldname,
              filename: uniqueFilename,
              encoding,
              mimetype: mimeType,
              size: buffer.length,
              originalFilename: filename,
            };

            validateFile(fileInfo, mergedOptions);

            if (mergedOptions.useCloudinary) {
              // Upload to Cloudinary
              const folderPath = mergedOptions.pathStructure
                ? `${mergedOptions.cloudinaryFolder}/${mergedOptions.pathStructure}`
                : mergedOptions.cloudinaryFolder;

              const cloudinaryFile = await CloudinaryUploadService.uploadFile(
                buffer,
                {
                  folder: folderPath,
                  public_id: uniqueFilename.replace(/\.[^/.]+$/, ""), // Remove extension
                  resource_type: "auto",
                  originalFilename: filename,
                }
              );

              // console.log("Cloudinary file upload result:", cloudinaryFile);
              // logger.debug(
              //   "Cloudinary upload successful:",
              //   JSON.stringify(cloudinaryFile)
              // );

              files.push({
                ...fileInfo,
                publicUrl: cloudinaryFile.publicUrl,
                cloudinaryId: cloudinaryFile.cloudinaryId,
                resourceType: cloudinaryFile.resourceType,
              });
            } else {
              // Fallback to local storage (for development or testing)
              const destinationPath = path.resolve(
                mergedOptions.destination!,
                mergedOptions.pathStructure || "",
                uniqueFilename
              );

              require("fs").mkdirSync(path.dirname(destinationPath), {
                recursive: true,
              });
              require("fs").writeFileSync(destinationPath, buffer);

              const publicUrlPath = mergedOptions.pathStructure
                ? path.join(mergedOptions.pathStructure, uniqueFilename)
                : uniqueFilename;

              const publicUrl = `/uploads/${publicUrlPath.replace(/\\/g, "/")}`;

              files.push({
                ...fileInfo,
                destination: path.dirname(destinationPath),
                path: destinationPath,
                publicUrl,
              });
            }

            // logger.debug(
            //   `File processed and added to files array: ${JSON.stringify({
            //     fieldname,
            //     filename: uniqueFilename,
            //     mimetype: mimeType,
            //   })}`
            // );

            fileResolve();
          } catch (error) {
            logger.error(`File processing error: ${error}`);
            fileReject(error);
            file.resume();
          }
        });
      });

      filePromises.push(filePromise);
    });

    busboy.on("field", (fieldname, val) => {
      if (fieldname.endsWith("[]")) {
        const baseFieldName = fieldname.substring(0, fieldname.length - 2);
        if (!fields[baseFieldName]) {
          fields[baseFieldName] = [];
        }
        fields[baseFieldName].push(val);
      } else {
        if (fields[fieldname] !== undefined) {
          if (!Array.isArray(fields[fieldname])) {
            fields[fieldname] = [fields[fieldname]];
          }
          fields[fieldname].push(val);
        } else {
          fields[fieldname] = val;
        }
      }
    });

    busboy.on("finish", async () => {
      try {
        // Wait for all file uploads to complete before resolving
        await Promise.all(filePromises);
        // logger.debug(`All files processed. Total: ${files.length}`);
        // logger.debug(
        //   `Returning files: ${JSON.stringify(
        //     files.map((f) => ({
        //       fieldname: f.fieldname,
        //       filename: f.filename,
        //       publicUrl: f.publicUrl,
        //     }))
        //   )}`
        // );
        resolve({ files, fields });
      } catch (error) {
        logger.error("Error during file upload processing:", error);
        reject(error);
      }
    });

    busboy.on("error", (error) => {
      logger.error("Busboy error:", error);
      reject(error);
    });

    req.pipe(busboy);
  });
};

// import { Request } from "express";
// import Busboy from "busboy";
// import fs from "fs";
// import path from "path";
// import { v4 as uuidv4 } from "uuid";
// import { logger } from "../utils/logger.js";
// import {
//   FileInfo,
//   UploadOptions,
//   UploadResult,
// } from "../types/file-upload-types.js";

// const DEFAULT_OPTIONS: UploadOptions = {
//   maxFileSize: 10 * 1024 * 1024, // 10MB
//   allowedMimeTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
//   destination: "uploads",
// };

// const ensureDirectoryExists = (dirPath: string): void => {
//   const absolutePath = path.resolve(dirPath);
//   if (!fs.existsSync(absolutePath)) {
//     fs.mkdirSync(absolutePath, { recursive: true });
//   }
// };

// const generateUniqueFilename = (originalName: string): string => {
//   const ext = path.extname(originalName);
//   return `${uuidv4()}${ext}`;
// };

// // Validates file against size and type constraints
// const validateFile = (
//   fileInfo: Omit<FileInfo, "destination" | "path" | "publicUrl">,
//   options: UploadOptions
// ): void => {
//   if (fileInfo.size > (options.maxFileSize || DEFAULT_OPTIONS.maxFileSize!)) {
//     throw new Error(
//       `File ${fileInfo.filename} exceeds maximum size of ${
//         options.maxFileSize! / 1024 / 1024
//       }MB`
//     );
//   }

//   const allowedTypes =
//     options.allowedMimeTypes || DEFAULT_OPTIONS.allowedMimeTypes!;
//   if (!allowedTypes.includes(fileInfo.mimetype)) {
//     throw new Error(
//       `File type ${
//         fileInfo.mimetype
//       } is not allowed. Allowed types: ${allowedTypes.join(", ")}`
//     );
//   }
// };

// export const handleFileUpload = (
//   req: Request,
//   options: Partial<UploadOptions> = {}
// ): Promise<UploadResult> => {
//   const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

//   const basePath = path.resolve(mergedOptions.destination!);
//   const fullDestination = mergedOptions.pathStructure
//     ? path.join(basePath, mergedOptions.pathStructure)
//     : basePath;

//   ensureDirectoryExists(fullDestination);

//   return new Promise((resolve, reject) => {
//     const busboy = Busboy({
//       headers: req.headers,
//       limits: {
//         fileSize: mergedOptions.maxFileSize,
//       },
//     });

//     const files: FileInfo[] = [];
//     const fields: Record<string, any> = {};

//     busboy.on("file", (fieldname, file, info) => {
//       const { filename, encoding, mimeType } = info;
//       const chunks: Buffer[] = [];
//       // const useOriginal = mergedOptions.useOriginalFilename || false;

//       file.on("data", (chunk) => {
//         chunks.push(chunk);
//       });

//       file.on("end", () => {
//         try {
//           const buffer = Buffer.concat(chunks);
//           const uniqueFilename = generateUniqueFilename(filename);

//           const destinationPath = path.join(fullDestination, uniqueFilename);

//           const publicUrlPath = mergedOptions.pathStructure
//             ? path.join(mergedOptions.pathStructure, uniqueFilename)
//             : uniqueFilename;

//           const publicUrl = `/uploads/${publicUrlPath.replace(/\\/g, "/")}`;

//           const fileInfo: Omit<FileInfo, "destination" | "path" | "publicUrl"> =
//             {
//               fieldname,
//               filename: uniqueFilename,
//               encoding,
//               mimetype: mimeType,
//               size: buffer.length,
//               originalFilename: filename,
//             };

//           validateFile(fileInfo, mergedOptions);
//           fs.writeFileSync(destinationPath, buffer);

//           files.push({
//             ...fileInfo,
//             destination: fullDestination,
//             path: destinationPath,
//             publicUrl,
//           });

//           // logger.info(`File uploaded: ${publicUrl} (${buffer.length} bytes)`);
//         } catch (error) {
//           logger.error(`File processing error: ${error}`);
//           file.resume();
//         }
//       });
//     });

//     busboy.on("field", (fieldname, val) => {
//       // Handle array fields (fieldname[] syntax)
//       if (fieldname.endsWith("[]")) {
//         const baseFieldName = fieldname.substring(0, fieldname.length - 2);
//         if (!fields[baseFieldName]) {
//           fields[baseFieldName] = [];
//         }
//         fields[baseFieldName].push(val);
//       } else {
//         // If field appears multiple times but doesn't use array syntax,
//         // convert to array automatically
//         if (fields[fieldname] !== undefined) {
//           if (!Array.isArray(fields[fieldname])) {
//             fields[fieldname] = [fields[fieldname]];
//           }
//           fields[fieldname].push(val);
//         } else {
//           fields[fieldname] = val;
//         }
//       }
//     });

//     busboy.on("finish", () => {
//       resolve({ files, fields });
//     });

//     busboy.on("error", (error) => {
//       logger.error("Busboy error:", error);
//       reject(error);
//     });

//     req.pipe(busboy);
//   });
// };

// // Gets a readable stream for a file
// export const getFileStream = (filePath: string): fs.ReadStream => {
//   if (!fs.existsSync(filePath)) {
//     throw new Error("File not found");
//   }
//   return fs.createReadStream(filePath);
// };

// // Deletes a file from the filesystem
// export const deleteFile = (filePath: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     fs.unlink(filePath, (error) => {
//       if (error) {
//         logger.error(`Error deleting file ${filePath}:`, error);
//         reject(error);
//       } else {
//         logger.info(`File deleted successfully: ${filePath}`);
//         resolve();
//       }
//     });
//   });
// };
