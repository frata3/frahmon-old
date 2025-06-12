const setLayout = require("../middleware/setLayout");

function notFoundHandler(app) {
  app.use(setLayout("layouts/main/main"), async (req, res, next) => {
    // res.status(404).json({
    //   message: "not found route",
    // });
    res.render("./errors/404.ejs", {title: "صفحه یافت نشد"});
  });
}
module.exports = notFoundHandler;
