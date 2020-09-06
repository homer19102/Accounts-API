import express from 'express';

import accountsRouter from './bank.routes.js';

const { Router } = express;

const routes = Router();

routes.use('/accounts', accountsRouter);

export default routes;
