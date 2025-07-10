import setAssets from "../middleware/setAssets.js";

function notFoundHandler(app) {
  app.use(
    setAssets({
    }),
    async (req, res, next) => {
      // res.status(404).json({
      //   message: "not found route",
      // });
      res.render("./errors/404.ejs", { title: "صفحه یافت نشد"});
    }
  );
}
export default notFoundHandler;
