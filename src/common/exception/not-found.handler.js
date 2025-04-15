function notFoundHandler(app) {
  app.use((req, res, next) => {
    // res.status(404).json({
    //   message: "not found route",
    // });
    
    res.render('./errors/404.ejs', { layout: './errors/404'});
  });
}
module.exports = notFoundHandler; 
