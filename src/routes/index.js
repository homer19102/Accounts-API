import express from 'express';
import { accountsRouter, balanceRouter } from './bank.routes.js';

const { Router } = express;

const routes = Router();

routes.use('/accounts', accountsRouter);

routes.use('/saldo', balanceRouter);

routes.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
  });
  
export default routes;
