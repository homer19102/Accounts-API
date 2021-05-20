import { db } from '../../databaseConnect.js';
import GoalsController from './GoalsController.js';
import MathValidations from '../utils/MathValidations.js';
import ValidStock from '../utils/ValidStock.js';

const expenses = db.expenses;
const Accounts = db.accounts;
const goals = db.goals;
const clientStocks = db.clientStocks;
const stock = db.stockmarketplace;

class UserStockController{
    async AddUserStockGoal(req, res, next){
        try{
            const { stockId, stockQtd, stockPrice} = req.body;

            let validStock = await ValidStock.validaStock(stockId, next);

            if(!validStock)
                return;

            //if(!await ValidStock.validaQuantidade(stockId, stockQtd, next))
              //  return null;

            const stockTotalValue = stockPrice * stockQtd

            const goal = await UpdateGoal(req, next, stockTotalValue);
            await UpdateStockRequests(validStock, stockQtd, next);
                
            return res.json("Valor " + `${ stockTotalValue } ` + "retirado da meta "  + `${ goal.nameGoal } ` + 
            "para o investimento " + `${ validStock.stockDisplayName } ` + ", efetuado com sucesso !");
        
        }catch(error){
            next(error);
        }
    }

    async AddUserStockAccount(req, res, next){
        try{
            const { stockId, parentId, stockQtd, stockPrice } = req.body;

            let validStock = await ValidStock.validaStock(stockId, next);

            if(!validStock)
                return;
            
            
           // if(!await ValidStock.validaQuantidade(stockId, stockQtd, next))
             //   return null;

            const stockTotalValue = stockPrice * stockQtd

            const accountExist = await Accounts.findOne( {_id : parentId });

            if(accountExist === null)
                throw new Error("Conta não encontrada na base de dados");

            await UpdateAccount(req, accountExist, stockTotalValue, next);
            await UpdateStockRequests(validStock, stockQtd, next);

            return res.json("Valor " + `${ stockTotalValue } ` + " retirado da conta corrente para o investimento " + `${ validStock.stockDisplayName } ` + ", efetuado com sucesso !");

        }catch(error){
            next(error);
        }
    }

    async GetUserStocks(req, res, next){
        try{

            const userId = req.params.userId

            const existStock = await clientStocks.aggregate([
                { $match : 
                    {
                         parentClientId : userId
                    }
                },
                {
                    $lookup:{
                        from: "StockMarketPlace",     
                        localField: "parentStockIdObject",  
                        foreignField: "_id", 
                        as: "user_stock" 
                    }
                }
            ]);

            if(!existStock)
                throw new Error("Não encontrado nenhum investimento na base de dados !");

            const data =[];

            existStock.forEach(x => {
                data.push({
                    id: x.parentStockId,
                    stockDisplayName: x.user_stock[0] ? x.user_stock[0].stockDisplayName : null,
                    totalInvestment: x.totalValue
                })
            })

            return res.json(data);

        }catch(error){
            next(error);
        }
    }
}

async function AddExpense(req, stockTotalValue, account, next){

        const { parentId, data} = req.body;

        const accountExist = await Accounts.findOne( {_id : parentId });
    
        const expenseValue = MathValidations.NegativeValue(stockTotalValue);
    
        if(accountExist === null)
            throw new Error("Conta não encontrada na base de dados");
    
        await expenses.create({
                parentId,
                parentName : account.parentName,
                valor: expenseValue,
                data : data,
                categoria : "Investimentos",
                descricao : "Teste"
            });
}

async function UpdateAccount(req, account, stockTotalValue, next){
    
        if(account.saldo < stockTotalValue)
            throw new Error("Saldo Insuficiente para efetuar a operação !");

        account.saldo -= stockTotalValue;
    
        const AccountUpdate =  await Accounts.findByIdAndUpdate(account._id, account, {
                new: true,
            });

        const newAccount = {
            ...account,
            parentName: account.filterName
        }

        if(AccountUpdate)
        {
            await AddExpense(req, stockTotalValue, newAccount, next);  
            await AddClientStocks(next, stockTotalValue, req, account._id)
        }
           
}

async function UpdateGoal(req, next, stockTotalValue){

        const { parentId } = req.body;

        const goal = await GoalsController.GetGoal(req, next);

        var userAccount = await Accounts.findOne({ _id : parentId });

        if(userAccount.id !== goal.parentId)
            throw new Error('Nenhuma meta chamada ' + `${goal.nameGoal } ` + ', foi encontrada para o usuário' + `${userAccount.name }`);
    
        if(goal.currentGoalValue < stockTotalValue)
            throw new Error('O valor contido na meta ' + `${goal.nameGoal } ` + 'não é sufuciente para efetuar a transação !');
    
        goal.currentGoalValue -= stockTotalValue;
    
        const goalUpdate =  await goals.findByIdAndUpdate(goal._id, goal, {
            new: true,
        });

        if(goalUpdate)
        {
            await AddExpense(req, stockTotalValue, goal, next);
            await AddClientStocks(next, stockTotalValue, req, goal.parentId);
            return goal;
        }
}

async function AddClientStocks(next, stockTotalValue, req, idCLiente){
    
    const{ stockQtd, stockId } = req.body;

        await clientStocks.create({
            parentClientId: idCLiente,
            parentStockIdObject: stockId,
            parentStockId: stockId,
            NumberOfStocks: stockQtd,
            totalValue: stockTotalValue,
        });

}

async function UpdateStockRequests(validStock, stockQtd, next){
  

        validStock.numberOfRequests += stockQtd;

        var s = await stock.findByIdAndUpdate(validStock._id, validStock, {
            new : true,
        });

  
}

export default new UserStockController();