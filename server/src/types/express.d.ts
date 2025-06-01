import { RequestContext } from "../middleware/context";

declare global {
  namespace Express {
    export interface Request {
      context: RequestContext;
      user?: User;
      files?: any;
      imageVariants?: any;
    }
  }
}
