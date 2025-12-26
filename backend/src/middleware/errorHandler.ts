import { Request, Response, NextFunction } from 'express';
import { formatResponse } from '../utils/helpers';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json(
      formatResponse(false, undefined, undefined, 'Duplicate entry. This record already exists.')
    );
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json(
      formatResponse(false, undefined, undefined, 'Referenced record does not exist.')
    );
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json(
    formatResponse(false, undefined, undefined, message)
  );
};

