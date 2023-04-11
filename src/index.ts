import express, { Request, Response } from "express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import bodyParser from "body-parser";

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const port = 8080;
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

app.get("/orders/:id", (req, res) => {
  res.send(req.params.id);
});

/**
 * @openapi
 * /orders:
 *   post:
 *     description: Order Post Request
 *     consumes:
 *        application/json
 *     produces:
 *         - application/json
 *         - text/xml
 *         - text/html
 *     parameters:
 *         - in: body
 *           name: orders
 *           description: create product orders
 *           required: false
 *           schema:
 *             type: object
 *             required:
 *               -customerId
 *             properties:
 *               customerId:
 *                  type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     amount:
 *                       number: string
 *                       example: 0.1
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *          application/json:
 *            schema:
 *             type: object
 *             example: {"id":0, createdAt:"2023-04-20T09:12:28Z", updatedAt:"2023-04-20T09:12:28Z", "items": [{ "productId": "string",  "amount": 0.1  }]}
 *       400:
 *         description: Bad Request
 *
 *
 *
 */

app.post("/orders", (req: Request, res: Response) => {
  let { customerId, items } = req.body;
  if (!customerId) {
    res.send({ status: 400, message: "No Customer ID" });
  }

  const date = new Date();

  console.log(req.body);
  const itemsWithNoProductId = items.filter(
    (item: { productId: string; amount: number }) =>
      !item.productId || item.productId === ""
  );
  const isAmountTooSmall = items.filter(
    (item: { productId: string; amount: number }) => item.amount < 0.1
  );

  if (!!itemsWithNoProductId.length) {
    res.status(400);
    res.send({ status: 400, message: "Bad Request: No Product ID" });
    return;
  }
  if (!!isAmountTooSmall.length) {
    res.status(400);
    res.send({
      status: 400,
      message: "Bad Request: amount can not be less than 0.1",
    });
    return;
  }

  res.status(200);
  res.send({
    status: 200,
    data: {
      id: Math.random(),
      createdAt: date,
      updatedAt: date,
      items,
    },
    message: "succesful",
  });
});

app.listen(port, () => {
  console.log(`app running on port: ${port}`);
  isHealthy = true;
});
