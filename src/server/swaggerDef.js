const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({
    path: path.resolve(__dirname, "../../.env.local"),
  });
}
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Trading Bot API",
      version: "1.0.0",
      description: "API documentation for Trading Bots",
    },
    servers: [
      {
        url:
          process.env.SWAGGER_SERVER_URL ||
          "http://localhost:" + process.env.PORT,
      },
    ],
  },

  apis: ["./src/server/routes/**/*.js"],
};

module.exports = swaggerJsdoc(options);
