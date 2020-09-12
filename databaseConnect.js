import mongoose from 'mongoose';
import accountsSchema from './src/models/Account.js';
import expensesSchema from './src/models/Expenses.js';
import dotenv from "dotenv";


const db = {};

dotenv.config();

db.url = process.env.DBCONNECTION;
db.mongoose = mongoose;
db.accounts = accountsSchema(mongoose);
db.expenses = expensesSchema(mongoose);

export { db };
