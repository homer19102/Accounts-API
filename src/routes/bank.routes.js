import express from 'express';

import AccountController from '../controllers/AccountController.js';

import BalancerController from '../controllers/BalanceController.js';


const { Router } = express;

const accountsRouter = Router();

const balanceRouter = Router();

//Accounts Router
accountsRouter.get('/', AccountController.getAccount);
accountsRouter.post('/NewUser/', AccountController.createAccount);
accountsRouter.delete('/DeleteUser', AccountController.delete);
accountsRouter.put('/UpdateUser', AccountController.update);

//Balance Router
balanceRouter.put('/Transfer', BalancerController.Transferencia);

export {accountsRouter as accountsRouter, balanceRouter as balanceRouter};