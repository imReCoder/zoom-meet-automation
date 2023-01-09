const express = require('express');
const userRoutes = require('./routes');
const { requestLogger } = require('./utils/requestLogger');
const { applyRoutes } = require('./utils/utils');

const app =  express();

const userRouter = express.Router();

app.use(requestLogger);
app.use("/",applyRoutes(userRouter,userRoutes))

module.exports = { app };