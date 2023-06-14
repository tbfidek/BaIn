const errorController = (res, err) => {
  res.statusCode = err.statusCode;
  res.end(err.message);
};

export default errorController;
