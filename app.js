import express from 'express';
import userRoutes from './routes.js';
import { requestLogger } from './utils/requestLogger.js';
import { applyRoutes } from './utils/utils.js';

const app =  express();

const userRouter = express.Router();

app.use(requestLogger);
app.use("/",applyRoutes(userRouter,userRoutes))

export {app};