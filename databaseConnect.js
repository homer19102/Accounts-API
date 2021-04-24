import mongoose from 'mongoose';
import accountsSchema from './src/models/Account.js';
import expensesSchema from './src/models/Expenses.js';
import goalsSchema from './src/models/Goals.js';
import accountSequenceSchema from './src/models/AccountSequence.js';
import stockMarketPlaceSchema from './src/models/StockMarketPlace.js';
import userStockSchema from './src/models/UserStock.js';
import clientStocksSchema from './src/models/ClientStocks.js';
import dotenv from "dotenv";


const db = {};

dotenv.config();

db.url = process.env.DBCONNECTION;
db.mongoose = mongoose;
db.accounts = accountsSchema(mongoose);
db.expenses = expensesSchema(mongoose);
db.goals = goalsSchema(mongoose);
db.accountSequence = accountSequenceSchema(mongoose);
db.stockmarketplace = stockMarketPlaceSchema(mongoose);
db.userStock = userStockSchema(mongoose);
db.clientStocks = clientStocksSchema(mongoose);

export { db };
