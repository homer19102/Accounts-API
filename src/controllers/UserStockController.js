import { db } from '../../databaseConnect.js';
import GoalsController from './GoalsController.js';
import MathValidations from '../utils/MathValidations.js';
import ValidStock from '../utils/ValidStock.js';
import DateTime from '../utils/DateTime.js';

const expenses = db.expenses;
const Accounts = db.accounts;
const goals = db.goals;
const clientStocks = db.clientStocks;
const stock = db.stockmarketplace;

class UserStockController{
    async AddUserStockGoal(req, res, next){
        try{
            const { stockId, stockQtd } = req.body;

            let validStock = await ValidStock.ValidaStock(stockId, next);

            if(!validStock)
                return;

            if(validStock.numberShares - validStock.numberOfRequests < stockQtd)
                throw new Error("A quantidade solicitada para compra excede a quantidade disponível de stocks");

            const stockTotalValue = validStock.stockPrice * stockQtd;

            const goal = await UpdateGoal(req, next, stockTotalValue, validStock);
            await UpdateStockRequests(validStock, stockQtd, next);
                
            return res.json("Valor " + `${ stockTotalValue } ` + "retirado da meta "  + `${ goal.nameGoal } ` + 
            "para o investimento " + `${ validStock.stockDisplayName } ` + ", efetuado com sucesso !");
        
        }catch(error){
            next(error);
        }
    }

    async AddUserStockAccount(req, res, next){
        try{
            const { stockId, parentId, stockQtd } = req.body;

            let validStock = await ValidStock.ValidaStock(stockId, next);

            if(!validStock)
                return;
            
            if(validStock.numberShares - validStock.numberOfRequests < stockQtd)
                throw new Error("A quantidade solicitada para compra excede a quantidade disponível de stocks");

            const stockTotalValue = validStock.stockPrice * stockQtd

            const accountExist = await Accounts.findOne( {_id : parentId });

            if(accountExist === null)
                throw new Error("Conta não encontrada na base de dados");

            await UpdateAccount(req, accountExist, stockTotalValue, next, validStock);

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
                    numberOfStocks: x.NumberOfStocks,
                    totalInvestment: x.totalValue,
                    buy_date: DateTime.FormatDate(x.buy_date),
                    sell_date: DateTime.FormatDate(x.sell_date)
                })
            })

            return res.json(data);

        }catch(error){
            next(error);
        }
    }
}

async function AddExpense(req, stockTotalValue, account, next, stock){

        const { parentId } = req.body;

        const accountExist = await Accounts.findOne( {_id : parentId });
    
        const expenseValue = MathValidations.NegativeValue(stockTotalValue);
    
        if(accountExist === null)
            throw new Error("Conta não encontrada na base de dados");
    
        await expenses.create({
                parentId,
                parentName : account.parentName,
                valor: expenseValue,
                data : DateTime.Now(),
                categoria : "Investimentos",
                descricao : stock.stockName
            });
}

async function UpdateAccount(req, account, stockTotalValue, next, stock){
    
        if(account.saldo < stockTotalValue)
            throw new Error("Saldo Insuficiente para efetuar a operação !");

        account.saldo -= stockTotalValue;
    

        const newAccount = {
            ...account,
            parentName: account.filterName
        }

        await AddClientStocks(next, stockTotalValue, req);

        await AddExpense(req, stockTotalValue, newAccount, next, stock);  
    
        await Accounts.findByIdAndUpdate(account._id, account, {
            new: true,
        });     
}

async function UpdateGoal(req, next, stockTotalValue, stock){

        const { parentId } = req.body;

        const goal = await GoalsController.GetGoal(req, next);

        var userAccount = await Accounts.findOne({ _id : parentId });

        if(userAccount.id !== goal.parentId)
            throw new Error('Nenhuma meta chamada ' + `${goal.nameGoal} ` + ' , foi encontrada para o usuário' + `${userAccount.name }`);
    
        if(goal.currentGoalValue < stockTotalValue)
            throw new Error('O valor contido na meta ' + `${goal.nameGoal} ` + ' não é sufuciente para efetuar a transação !');
    
        goal.currentGoalValue -= stockTotalValue;
    
        await AddClientStocks(next, stockTotalValue, req);

        await AddExpense(req, stockTotalValue, goal, next, stock);

        await goals.findByIdAndUpdate(goal._id, goal, {
            new: true,
        });

        return goal;
      
}

async function AddClientStocks(next, stockTotalValue, req){
    
    const{ stockQtd, stockId, parentId } = req.body;

    const stockUser = await clientStocks.findOne( { parentStockIdObject : stockId, parentClientId: parentId } );

    if(stockUser)
    {
        stockUser.NumberOfStocks += stockQtd;
        stockUser.totalValue += stockTotalValue;

        stockUser.totalValue = (Math.round( stockUser.totalValue  * 100) / 100);

        await clientStocks.findByIdAndUpdate(stockUser._id, stockUser, {
            new: true,
        });
    }

    else
    {
        const dateNow = DateTime.Now();

        const addDay = DateTime.AddDays(365);

        await clientStocks.create({
            parentClientId: parentId,
            parentStockIdObject: stockId,
            parentStockId: stockId,
            NumberOfStocks: stockQtd,
            totalValue: stockTotalValue,
            buy_date : DateTime.Now(),
            sell_date : DateTime.AddDays(365)
        });
    }
}

async function UpdateStockRequests(validStock, stockQtd, next){

        validStock.numberOfRequests += stockQtd;

        await stock.findByIdAndUpdate(validStock._id, validStock, {
            new : true,
        });

  
}

export default new UserStockController();