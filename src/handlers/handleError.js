const ErrorResponse = require("./AppError");

const errorHandler = (err, req, res, next) => {
  console.log("this is err",err.name,err.statusCode)
  let error = { ...err };
  console.log("error",error)
  // err ka nam class se pass hokkr ata hai to error. message bn jata hai
  //error ka loop or  mongo error ko detech krne k liye kiya h bass
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.message === "CastError") {
    const message = `Resource not found`;
    error = new ErrorResponse(null, message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = "Duplicate field value entered";
    error = new ErrorResponse(null, message, 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    console.log("boom")
    const message = "validation error in mongodb";
    error = new ErrorResponse(null, message, 400);
  }

  if (err.name === "SyntaxError") {
    const message = "SyntaxError in request data",
      error = new ErrorResponse(null, message, 400);
  }
  if (err.name === "TypeError") {
    const message = "Type error in code";
    error = new ErrorResponse(null, message, 400);
  }
  
  if (err.name === "Error") {
    const message = "error in code";
    error = new ErrorResponse(null, message, 400);
  }

  return res.status(error.statusCode).json({
    success: false, 
    error: error.message || "internal server error",
    name: error.name || "server Error",
  });
};

module.exports = errorHandler;
