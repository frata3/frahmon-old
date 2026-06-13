import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
function swaggerConfig(app) {
  const swaggerOptions = {
    swaggerDefinition: {
      openapi: "3.0.1",
      info: {
        title: "Frahmon",
        version: "1.0.0",
      },
    },
    apis: [process.cwd() + "/src/modules/**/*.swagger.js"],
  };
  const swaggerDoc = swaggerJSDoc(swaggerOptions);
  const swagger = swaggerUi.setup(swaggerDoc);
  if (process.env.NODE_ENV === "development") {
    app.use("/api-docs", swaggerUi.serve, swagger);
  }
}

export default swaggerConfig;