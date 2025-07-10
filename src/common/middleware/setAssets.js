export function js(src, options = {}) {
  return { src, ...options };
}

export function css(href, options = {}) {
  return { href, ...options };
}

export default function setAssets({ css = [], js = [] }) {
  return (req, res, next) => {
    res.locals.cssFiles = [...(res.locals.cssFiles || []), ...css];
    res.locals.jsFiles = [...(res.locals.jsFiles || []), ...js];
    next();
  };
}
