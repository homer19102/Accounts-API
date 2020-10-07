import express from 'express';

import AccountController from '../controllers/AccountController.js';

import BalancerController from '../controllers/BalanceController.js';

import ExpensesController from '../controllers/ExpensesController.js'

import GoalsController from '../controllers/GoalsController.js';

import LoginController from '../controllers/LoginController.js';


const { Router } = express;

const accountsRouter = Router();

const balanceRouter = Router();

const expensesRouter = Router();

const goalsRouter = Router();

const loginRouter = Router();

//Accounts Router
accountsRouter.get('/', AccountController.getAccount);
accountsRouter.post('/NewUser/', AccountController.createAccount);
accountsRouter.delete('/DeleteUser', AccountController.delete);
accountsRouter.put('/UpdateUser', AccountController.update);

//Balance Router
balanceRouter.put('/Transfer', BalancerController.Transferencia);


//Expense Router
expensesRouter.get('/', ExpensesController.getExpensePorUsuario);
expensesRouter.post('/NewExpense', ExpensesController.AddExpense);
expensesRouter.delete('/DeleteExpense', ExpensesController.DeleteExpense);
expensesRouter.put('/PutExpense', ExpensesController.PutExpense);

//Goals Router
goalsRouter.post('/NewGoal', GoalsController.PostGoal);
goalsRouter.put('/TransferToGoal', GoalsController.PutTransferToGoal);
goalsRouter.delete('/DeleteGoal', GoalsController.DeleteGoal);

//Login Router
loginRouter.get('/', LoginController.Login);

export {accountsRouter as accountsRouter, balanceRouter as balanceRouter, expensesRouter as expensesRouter, goalsRouter as goalsRouter, loginRouter as loginRouter};