export function addAssetsSupport(req, res, next) {
    res.addAssets = function ({ css = [], js = [] }) {
      res.locals.cssFiles = [...(res.locals.cssFiles || []), ...css.map(toCss)];
      res.locals.jsFiles = [...(res.locals.jsFiles || []), ...js.map(toJs)];
    };
    next();
  }
  
  function toCss(file) {
    return typeof file === "string" ? { href: file } : file;
  }
  
  function toJs(file) {
    return typeof file === "string" ? { src: file } : file;
  }
  