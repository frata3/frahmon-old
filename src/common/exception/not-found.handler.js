function notFoundHandler(app) {
  app.use((req, res, next) => {
    // res.status(404).json({
    //   message: "not found route",
    // });
    res.render('./pages/notFound/404.ejs', { layout: './pages/notFound/404'});
  });
}
module.exports = notFoundHandler; 
