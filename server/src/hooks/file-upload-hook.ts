import { RequestContext } from "../middleware/context.js";
import { handleFileUpload } from "../lib/file-upload.js";
import { logger } from "../utils/logger.js";
import { UploadOptions } from "../types/file-upload-types.js";
import { ImageProcessingOptions } from "../services/image-processing.service.js";

export interface EnhancedUploadOptions extends UploadOptions {
  processImages?: boolean;
  imageProcessingOptions?: ImageProcessingOptions;
  convertTextToJson?: boolean;
  preservePath?: boolean;
  useFirebase?: boolean;

  fieldMapping?: {
    sourceField: string;
    targetField: string;
    isArray?: boolean;
    transformPath?: (filename: string) => string;
  }[];
  combineExistingFiles?: {
    existingFieldName: string;
    targetFieldName: string;
    newFileFieldName: string;
  }[];
}

export const FileUploadHooks = {
  async processFileUpload(
    context: RequestContext,
    options: Partial<EnhancedUploadOptions> = {}
  ): Promise<void> {
    if (!context.req.is("multipart/form-data")) return;

    // logger.debug(
    //   "Starting file upload processing with options:",
    //   JSON.stringify(options)
    // );

    try {
      const { files, fields } = await handleFileUpload(context.req, options);

      // logger.debug(
      //   "Files received from handleFileUpload:",
      //   JSON.stringify(
      //     files.map((f) => ({
      //       fieldname: f.fieldname,
      //       filename: f.filename,
      //       publicUrl: f.publicUrl,
      //       cloudinaryId: f.cloudinaryId,
      //     }))
      //   )
      // );

      context.files = files || [];
      context.imageVariants = [];

      let processedFields = { ...fields };

      if (options.convertTextToJson) {
        processedFields = this.convertFieldsToJson(fields);
        // logger.debug(
        //   "Fields after convertTextToJson:",
        //   JSON.stringify(processedFields)
        // );
      }

      context.body = {
        ...context.body,
        ...processedFields,
      };

      let filesByField: Record<string, any[]> = {};

      if (context.files && context.files.length > 0) {
        filesByField = context.files.reduce((acc, file) => {
          if (!acc[file.fieldname]) {
            acc[file.fieldname] = [];
          }
          acc[file.fieldname].push(file);
          return acc;
        }, {} as Record<string, any[]>);

        // logger.debug(
        //   "Files grouped by field:",
        //   JSON.stringify(Object.keys(filesByField))
        // );

        Object.keys(filesByField).forEach((fieldname) => {
          if (fieldname === "backgroundImages") {
            context.body[fieldname] = filesByField[fieldname];
          } else if (filesByField[fieldname].length === 1) {
            context.body[fieldname] = filesByField[fieldname][0];
          } else {
            context.body[fieldname] = filesByField[fieldname];
          }
        });
      }

      // logger.debug(
      //   "Context body after adding files:",
      //   JSON.stringify(context.body)
      // );

      if (options.fieldMapping && options.fieldMapping.length > 0) {
        // logger.debug(
        //   "Field mappings found:",
        //   JSON.stringify(options.fieldMapping)
        // );
        this.processFieldMappings(context, filesByField, options.fieldMapping);
        // logger.debug(
        //   "Context body after field mapping:",
        //   JSON.stringify(context.body)
        // );
      }

      if (
        options.combineExistingFiles &&
        options.combineExistingFiles.length > 0
      ) {
        // logger.debug(
        //   "Combine existing files config:",
        //   JSON.stringify(options.combineExistingFiles)
        // );
        this.processCombinedFiles(
          context,
          filesByField,
          processedFields,
          options.combineExistingFiles
        );
        // logger.debug(
        //   "Context body after combining files:",
        //   JSON.stringify(context.body)
        // );
      }

      context.req.body = context.body;
      // logger.debug(
      //   "Final request body after file processing:",
      //   JSON.stringify(context.req.body)
      // );
    } catch (error) {
      logger.error("File upload processing failed:", error);
      throw error;
    }
  },

  processFieldMappings(
    context: RequestContext,
    filesByField: Record<string, any[]>,
    fieldMappings: EnhancedUploadOptions["fieldMapping"] = []
  ): void {
    fieldMappings.forEach((mapping) => {
      // logger.debug(
      //   `Processing field mapping: ${mapping.sourceField} -> ${mapping.targetField}`
      // );

      if (filesByField[mapping.sourceField]) {
        const transformPath =
          mapping.transformPath ||
          ((file: any) =>
            typeof file === "string"
              ? file
              : file.publicUrl || `/uploads/${file.filename}`);

        const mappedFiles = filesByField[mapping.sourceField].map((file) =>
          typeof file === "string" ? file : transformPath(file)
        );

        // logger.debug(
        //   `Mapped files for ${mapping.targetField}:`,
        //   JSON.stringify(mappedFiles)
        // );

        if (mapping.isArray) {
          context.body[mapping.targetField] = mappedFiles;
        } else if (mappedFiles.length === 1) {
          context.body[mapping.targetField] = mappedFiles[0];
        } else {
          context.body[mapping.targetField] = mappedFiles;
        }
      } else {
        // logger.debug(
        //   `Source field ${mapping.sourceField} not found in filesByField`
        // );
      }
    });
  },

  processCombinedFiles(
    context: RequestContext,
    filesByField: Record<string, any[]>,
    processedFields: Record<string, any>,
    combineOptions: EnhancedUploadOptions["combineExistingFiles"] = []
  ): void {
    combineOptions.forEach((option) => {
      try {
        let existingFiles = [];
        if (processedFields[option.existingFieldName]) {
          existingFiles = this.parseArrayField(
            processedFields[option.existingFieldName]
          );
        }

        const newFiles =
          filesByField[option.newFileFieldName]?.map(
            (file) => file.publicUrl || `/uploads/${file.filename}`
          ) || [];

        // logger.debug(`Combining files for ${option.targetFieldName}:`, {
        //   existing: existingFiles,
        //   new: newFiles,
        // });

        context.body[option.targetFieldName] = [...existingFiles, ...newFiles];
      } catch (error) {
        logger.error(
          `Error processing combined files for field ${option.targetFieldName}:`,
          error
        );
      }
    });
  },

  parseArrayField(field: any): any[] {
    if (typeof field === "string") {
      try {
        const parsed = JSON.parse(field);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (e) {
        return [field];
      }
    } else if (Array.isArray(field)) {
      return field;
    } else if (field) {
      return [field];
    }
    return [];
  },

  convertFieldsToJson(fields: Record<string, any>): Record<string, any> {
    const result: Record<string, any> = {};

    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string") {
        try {
          if (
            (value.trim().startsWith("{") && value.trim().endsWith("}")) ||
            (value.trim().startsWith("[") && value.trim().endsWith("]"))
          ) {
            result[key] = JSON.parse(value);
            continue;
          }

          if (key.endsWith("[]")) {
            const baseKey = key.slice(0, -2);
            if (!result[baseKey]) {
              result[baseKey] = [];
            }
            result[baseKey].push(value);
            continue;
          }
        } catch (e: any) {
          // logger.debug(`Failed to parse field ${key} as JSON`, e);
          console.error(`Failed to parse field ${key} as JSON: ${e.message}`);
        }
      }

      result[key] = value;
    }

    return result;
  },
};

// import { RequestContext } from "../middleware/context.js";
// import { handleFileUpload } from "../lib/file-upload.js";
// import {
//   ImageProcessingOptions,
//   // processMultipleImages,
// } from "../services/image-processing.service.js";
// import { UploadOptions } from "../types/file-upload-types.js";
// import { logger } from "../utils/logger.js";
// import path from "path";

// export interface EnhancedUploadOptions extends UploadOptions {
//   processImages?: boolean;
//   imageProcessingOptions?: ImageProcessingOptions;
//   convertTextToJson?: boolean;
//   preservePath?: boolean;
//   useFirebase?: boolean;

//   fieldMapping?: {
//     sourceField: string;
//     targetField: string;
//     isArray?: boolean;
//     transformPath?: (filename: string) => string;
//   }[];
//   // Option to combine existing and new files
//   combineExistingFiles?: {
//     existingFieldName: string;
//     targetFieldName: string;
//     newFileFieldName: string;
//   }[];
// }

// export const FileUploadHooks = {
//   async processFileUpload(
//     context: RequestContext,
//     options: Partial<EnhancedUploadOptions> = {}
//   ): Promise<void> {
//     if (!context.req.is("multipart/form-data")) return;

//     try {
//       const { files, fields } = await handleFileUpload(context.req, options);
//       context.files = files;
//       context.imageVariants = [];

//       let processedFields = { ...fields };

//       if (options.convertTextToJson) {
//         processedFields = this.convertFieldsToJson(fields);
//       }

//       context.body = {
//         ...context.body,
//         ...processedFields,
//         uploadPath: options.pathStructure
//           ? path.join(options.destination || "uploads", options.pathStructure)
//           : options.destination || "uploads",
//       };

//       let filesByField: Record<string, any[]> = {};

//       if (context.files && context.files.length > 0) {
//         // Group files by field name
//         filesByField = context.files.reduce(
//           (acc, file) => {
//             if (!acc[file.fieldname]) {
//               acc[file.fieldname] = [];
//             }
//             acc[file.fieldname].push(file);
//             return acc;
//           },
//           {} as Record<string, any[]>
//         );

//         // Add files to body for validation
//         Object.keys(filesByField).forEach((fieldname) => {
//           if (fieldname === "backgroundImages") {
//             context.body[fieldname] = filesByField[fieldname];
//           } else if (filesByField[fieldname].length === 1) {
//             context.body[fieldname] = filesByField[fieldname][0];
//           } else {
//             context.body[fieldname] = filesByField[fieldname];
//           }
//         });
//       }

//       // Handle dynamic field mappings
//       if (options.fieldMapping && options.fieldMapping.length > 0) {
//         this.processFieldMappings(context, filesByField, options.fieldMapping);
//       }

//       // Handle combining existing and new files
//       if (
//         options.combineExistingFiles &&
//         options.combineExistingFiles.length > 0
//       ) {
//         this.processCombinedFiles(
//           context,
//           filesByField,
//           processedFields,
//           options.combineExistingFiles
//         );
//       }

//       // Update req.body for validation middleware
//       context.req.body = context.body;
//     } catch (error) {
//       logger.error("File upload processing failed:", error);
//       throw error;
//     }
//   },

//   processFieldMappings(
//     context: RequestContext,
//     filesByField: Record<string, any[]>,
//     fieldMappings: EnhancedUploadOptions["fieldMapping"] = []
//   ): void {
//     fieldMappings.forEach((mapping) => {
//       if (filesByField[mapping.sourceField]) {
//         const transformPath =
//           mapping.transformPath ||
//           ((filename: string) => `/uploads/${filename}`);

//         const mappedFiles = filesByField[mapping.sourceField].map((file) =>
//           transformPath(file.filename)
//         );

//         if (mapping.isArray) {
//           context.body[mapping.targetField] = mappedFiles;
//         } else if (mappedFiles.length === 1) {
//           context.body[mapping.targetField] = mappedFiles[0];
//         } else {
//           context.body[mapping.targetField] = mappedFiles;
//         }
//       }
//     });
//   },

//   processCombinedFiles(
//     context: RequestContext,
//     filesByField: Record<string, any[]>,
//     processedFields: Record<string, any>,
//     combineOptions: EnhancedUploadOptions["combineExistingFiles"] = []
//   ): void {
//     combineOptions.forEach((option) => {
//       try {
//         // Get existing files
//         let existingFiles = [];
//         if (processedFields[option.existingFieldName]) {
//           existingFiles = this.parseArrayField(
//             processedFields[option.existingFieldName]
//           );
//         }

//         // Get new files
//         const newFiles =
//           filesByField[option.newFileFieldName]?.map(
//             (file) => `/uploads/${file.filename}`
//           ) || [];

//         // Combine both existing and new files
//         context.body[option.targetFieldName] = [...existingFiles, ...newFiles];
//       } catch (error) {
//         logger.error(
//           `Error processing combined files for field ${option.targetFieldName}:`,
//           error
//         );
//       }
//     });
//   },

//   parseArrayField(field: any): any[] {
//     if (typeof field === "string") {
//       try {
//         const parsed = JSON.parse(field);
//         return Array.isArray(parsed) ? parsed : [parsed];
//       } catch (e) {
//         return [field];
//       }
//     } else if (Array.isArray(field)) {
//       return field;
//     } else if (field) {
//       return [field];
//     }
//     return [];
//   },

//   convertFieldsToJson(fields: Record<string, any>): Record<string, any> {
//     const result: Record<string, any> = {};

//     for (const [key, value] of Object.entries(fields)) {
//       if (typeof value === "string") {
//         try {
//           if (
//             (value.trim().startsWith("{") && value.trim().endsWith("}")) ||
//             (value.trim().startsWith("[") && value.trim().endsWith("]"))
//           ) {
//             result[key] = JSON.parse(value);
//             continue;
//           }

//           // Handle arrays sent as multiple fields with same name
//           if (key.endsWith("[]")) {
//             const baseKey = key.slice(0, -2);
//             if (!result[baseKey]) {
//               result[baseKey] = [];
//             }
//             result[baseKey].push(value);
//             continue;
//           }
//         } catch (e) {
//           // If parsing fails, use the original string value
//           logger.debug(`Failed to parse field ${key} as JSON`, e);
//         }
//       }

//       // Default case: use the original value
//       result[key] = value;
//     }

//     return result;
//   },
// };
