import express from 'express';
import { 
   accountsRouter,
   balanceRouter,
   expensesRouter,
   goalsRouter,
   stockRouter,
   propertyRouter,
   averageSellingPriceRouter,
   passwordRouter,
   loginRouter,
   refreshTokenRouter
} from './bank.routes.js';

import authMiddleware from '../middleware/auth.js';

const { Router } = express;

const routes = Router();

routes.use(authMiddleware);

routes.use('/accounts', accountsRouter);

routes.use('/saldo', balanceRouter);

routes.use('/expenses', expensesRouter);

routes.use('/goals', goalsRouter);

routes.use('/stocks', stockRouter);

routes.use('/property', propertyRouter);

routes.use('/averageSellingPriceRouter', averageSellingPriceRouter);

routes.use('/password', passwordRouter);

routes.use('/refreshToken', refreshTokenRouter);

routes.use('/login', loginRouter);


routes.use((err, req, res, next) => {
    res.status(400).send({ error: err.message });
  });
  
export default routes;
