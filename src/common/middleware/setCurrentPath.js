export default function setCurrentPath(req, res, next) {
  const path = req.path;
  const section = path.split("/")[1] || "home";

  res.locals.currentPath = path;
  res.locals.currentSection = section;
  next();
};