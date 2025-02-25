function notFoundHandler(app) {
  app.use((req, res, next) => {
    // res.status(404).json({
    //   message: "not found route",
    // });
    res.render('./pages/404.ejs', { layout: './pages/404'});
  });
}
module.exports = notFoundHandler; 
