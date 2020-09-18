import express from 'express';
import { accountsRouter, balanceRouter, expensesRouter, goalsRouter, loginRouter } from './bank.routes.js';

const { Router } = express;

const routes = Router();
 
routes.use('/accounts', accountsRouter);

routes.use('/saldo', balanceRouter);

routes.use('/expenses', expensesRouter);

routes.use('/goals', goalsRouter);

routes.use('/login', loginRouter);

routes.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
  });
  
export default routes;
