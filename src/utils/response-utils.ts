import { Response } from "express-serve-static-core";

export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  error?: any
) => {
  console.error(message, error || "");
  res.status(statusCode).json({
    "status-code": -1,
    "status-message": message,
    error,
  });
};

export const sendSuccessResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data: any
) => {
  res.status(statusCode).json({
    "status-code": 1,
    "status-message": message,
    data,
  });
};
