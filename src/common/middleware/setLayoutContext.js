async function setLayoutContext(req, res, next) {
  if (/\.\w+$/.test(req.path)) return next();

  const fullPath = req.path;
  const segments = fullPath.split("/").filter(Boolean); // ['me', 'profile']
  if (segments[0]?.startsWith("@")) {
    res.locals.currentSection = "@user";
    res.locals.subSection = segments[1] || null;
  } else {
    res.locals.currentSection = segments[0] || null;
    res.locals.subSection = segments[1] || null;
  }

  res.locals.currentPath = fullPath;

  next();
}

module.exports = setLayoutContext;

