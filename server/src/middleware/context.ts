import mongoose, { ClientSession, Document, Model } from "mongoose";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { FileInfo } from "../types/file-upload-types.js";
import { ROLE } from "../config/constants.js";

export class RequestContext {
  private _params: Record<string, any>;
  public body: any;
  public user?: {
    id: string;
    email: string;
    role: ROLE;
  };
  private _session?: ClientSession;
  public files?: FileInfo[];
  public imageVariants?: FileInfo[];
  query?: { [key: string]: string | undefined };

  constructor(
    public db: mongoose.Connection,
    public req: Request,
    public res: Response
  ) {
    this._params = { ...(req.params || {}) };

    // Extract ID from URL if params is empty but URL contains segments
    // if (
    //   Object.keys(this._params).length === 0 &&
    //   req.originalUrl.includes("/")
    // ) {
    //   const pathSegments = req.originalUrl.split("/").filter(Boolean);
    //   const lastSegment = pathSegments[pathSegments.length - 1];

    //   // Check if the last segment looks like a MongoDB ID
    //   if (/^[a-f0-9]{24}$/i.test(lastSegment)) {
    //     this._params.id = lastSegment;
    //     // Also update req.params so other middleware can access it
    //     req.params.id = lastSegment;
    //   }
    // }

    this.body = req.body || {};
    this.user = req.user as { id: string; email: string; role: ROLE };
    this.files = (req as any).files;
    this.imageVariants = (req as any).imageVariants;
    this.query = Object.fromEntries(
      Object.entries(req.query || {}).map(([key, value]) => [
        key,
        typeof value === "string" ? value : undefined,
      ])
    );
  }

  // Getter for params to ensure we always return the latest
  get params(): Record<string, any> {
    // Combine stored params with any new req.params that might have been added
    return { ...this._params, ...(this.req.params || {}) };
  }

  // Setter in case we need to update params explicitly
  set params(value: Record<string, any>) {
    this._params = value;
    // Also update req.params to keep them in sync
    Object.assign(this.req.params, value);
  }

  get session(): ClientSession | undefined {
    return this._session;
  }

  async withTransaction<T>(
    callback: (session: ClientSession) => Promise<T>
  ): Promise<T> {
    if (this._session) {
      return callback(this._session);
    }

    const session = await this.db.startSession();
    this._session = session;

    try {
      let result: T;
      await session.withTransaction(async () => {
        result = await callback(session);
      });
      return result!;
    } catch (error) {
      if (session.transaction.isActive) {
        await session.abortTransaction();
      }
      throw error;
    } finally {
      this._session = undefined;
      await session.endSession();
    }
  }

  /**
   * Helper method to run a query within the current transaction (if exists)
   * @param model Mongoose model
   * @param query Query to be executed
   */
  async runQuery<T extends Document>(
    model: Model<T>,
    query: (model: Model<T>, session?: ClientSession) => Promise<T | T[] | null>
  ): Promise<T | T[] | null> {
    return query(model, this._session);
  }
}

export const contextMiddleware = (db: mongoose.Connection): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Ensure req.params exists
    req.params = req.params || {};

    // Create context with enhanced parameter extraction
    const context = new RequestContext(db, req, res);
    (req as any).context = context;

    res.on("finish", async () => {
      if (context.session) {
        try {
          await context.session.endSession();
        } catch (error) {
          console.error("Error cleaning up session:", error);
        }
      }
    });

    next();
  };
};
