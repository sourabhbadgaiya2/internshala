exports.generatedErrors = (err, req, res, next) => {
  const statuscode = err.statuscode || 500;

  if (res.headersSent) {
    return next(err);
  }

  if (
    err.name === 'MongoServerError' &&
    err.message.includes('E11000 duplicate key')
  ) {
    err.message = 'Students with this email address already exists';
  }
  res.status(statuscode).json({
    message: err.message,
    errName: err.name,
    // stack: err.stack,
  });
};
