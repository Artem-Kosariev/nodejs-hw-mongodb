export const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Something went wrong';
  const errorResponse = {
    status: statusCode,
    message,
  };

  res.status(statusCode).json(errorResponse);
};
