import express from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
const port = 5000;
let isHealthy: boolean = false;

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "open-api doc",
      version: "1.0.0",
    },
    basePath: "/",
  },
  apis: [`${__dirname}/index.ts`],
};

const swaggerDocs = swaggerJSDoc(options);

app.get("/", (req, res) => res.send("Test"));

/**
 * @openapi
 * /docs:
 *   get:
 *     description: open-api doc
 *     responses:
 *       200:
 *         description: open-api doc.
 */

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));


/**
 * @openapi
 * /v3/api-docs:
 *   get:
 *     description: apiDocs
 *     responses:
 *       200:
 *         description: 200 response
 *         content:
 *             application/json:
 *                 schema:
 *                  types: {}
 *
 */

app.get("/v3/api-docs", (req, res) => res.json(swaggerDocs));

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     description: health check
 *     responses:
 *       200:
 *         description: 200 response
 *         content:
 *          application/json:
 *              schema:
 *                  string
 *
 */
app.get("/healthcheck", (req, res) => {
  let statusCode;

  if (isHealthy) {
    statusCode = 200;
    res.status(statusCode);
    res.json({ message: "Healthy", code: statusCode, successful: isHealthy });
  } else {
    statusCode = 503;
    res.status(statusCode);
    res.json({ message: "Unhealthy", code: statusCode, successful: isHealthy });
  }
});

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
  isHealthy = true;
});
