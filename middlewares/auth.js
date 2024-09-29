const jwt = require('jsonwebtoken');
const ErrorHandler = require('../utils/errorHandler');
const { catchasyncErrors } = require('./catchasyncErrors');

exports.isAuthenticated = catchasyncErrors(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(
      new ErrorHandler('please login in to access the resource', 401)
    );
  }

  const { id } = jwt.verify(token, process.env.JWT_SECRET);
  req.id = id;
  next();
  // res.json({id,token});
});
