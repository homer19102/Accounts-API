import express from 'express';

import AccountController from '../controllers/AccountController.js';


const { Router } = express;

const accountsRouter = Router();

accountsRouter.get('/', AccountController.getAccount);
accountsRouter.post('/NewUser/', AccountController.createAccount);
accountsRouter.delete('/DeleteUser', AccountController.delete);
accountsRouter.put('/UpdateUser', AccountController.update);


export default accountsRouter;