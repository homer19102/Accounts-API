import express from 'express';

import AccountController from '../controllers/AccountController.js';

import BalancerController from '../controllers/BalanceController.js';

import ExpensesController from '../controllers/ExpensesController.js'

import GoalsController from '../controllers/GoalsController.js';

import LoginController from '../controllers/LoginController.js';

import StocksController from '../controllers/StocksController.js';

import UserStockController  from '../controllers/UserStockController.js';

import PropertyController from '../controllers/PropertyController.js';

import AverageSellingPriceController from '../controllers/AverageSellingPriceController.js';

import PasswordController from '../controllers/PasswordController.js';

import RefreshTokenController from '../controllers/RefreshTokenController.js';

const { Router } = express;

const accountsRouter = Router();

const balanceRouter = Router();

const expensesRouter = Router();

const goalsRouter = Router();

const stockRouter = Router();

const propertyRouter = Router();

const averageSellingPriceRouter = Router();

const passwordRouter = Router();

const loginRouter = Router();

const refreshTokenRouter = Router();

//Accounts Router
accountsRouter.get('/', AccountController.getAccount);
accountsRouter.post('/NewUser/', AccountController.createAccount);
accountsRouter.delete('/DeleteUser', AccountController.delete);
accountsRouter.put('/UpdateUser', AccountController.update);
accountsRouter.get('/GetUserFilterName/:filterName', AccountController.getUserFilterName);

//Balance Router
balanceRouter.put('/Transfer', BalancerController.Transferencia);


//Expense Router
expensesRouter.get('/:userId', ExpensesController.getExpensePorUsuario);
expensesRouter.post('/NewExpense', ExpensesController.AddExpense);
expensesRouter.delete('/DeleteExpense', ExpensesController.DeleteExpense);
expensesRouter.put('/PutExpense', ExpensesController.PutExpense);

//Goals Router
goalsRouter.post('/NewGoal', GoalsController.PostGoal);
goalsRouter.put('/TransferToGoal', GoalsController.PutTransferToGoal);
goalsRouter.delete('/DeleteGoal', GoalsController.DeleteGoal);
goalsRouter.get('/GetGoalsUser/:userId', GoalsController.GetGoals);
goalsRouter.put('/UpdateTargetValue', GoalsController.PutValueGoal);
goalsRouter.post('/RemoveValue', GoalsController.PostRemoveValueGoal);

//Stocks Router
stockRouter.post('/NewStock', StocksController.PostStock);
stockRouter.get('/GetStocks', StocksController.GetStocks);
stockRouter.get('/GetStock/:stockId', StocksController.GetStock);

//User Stocks
stockRouter.post('/PostStockUserGoal', UserStockController.AddUserStockGoal);
stockRouter.post('/PostStockUserAccount', UserStockController.AddUserStockAccount);
stockRouter.get('/GetUserStocks/:userId', UserStockController.GetUserStocks);

//Property
propertyRouter.post('/PostPropertyOccupation', PropertyController.PostPropertyOccupation);

//Average Selling Price
averageSellingPriceRouter.post('/PostAverageSellingPrice', AverageSellingPriceController.PostAverageSellingPrice);

//Password controller
passwordRouter.post('/ResetPassword', PasswordController.ResetPassword);

//Refresh Token
refreshTokenRouter.post('/NewToken', RefreshTokenController.NewToken);

//Login Router
loginRouter.post('/', LoginController.Login);

export {accountsRouter as accountsRouter,
     balanceRouter as balanceRouter,
     expensesRouter as expensesRouter,
     goalsRouter as goalsRouter,
     stockRouter as stockRouter,
     refreshTokenRouter as refreshTokenRouter,
     loginRouter as loginRouter,
     passwordRouter as passwordRouter,
     propertyRouter as propertyRouter,
     averageSellingPriceRouter as averageSellingPriceRouter };