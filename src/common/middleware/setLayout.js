module.exports = (layoutPath) => {
  return (req, res, next) => {
      req.app.set("layout", layoutPath);
      next();
  };
};