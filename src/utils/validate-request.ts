import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

type ValidationTarget = "body" | "params" | "query";

export const validateSchema =
  (schema: ZodSchema, target: ValidationTarget = "body") =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
      req[target] = schema.parse(req[target]);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        res.status(400).json({
          "status-code": -1,
          "status-message": "Validation Error",
          errors: err.errors,
        });
        return;
      }
      next(err);
    }
  };
