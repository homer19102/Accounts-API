import { db } from '../../databaseConnect.js';

const expenses = db.expenses;

class ExpensesController {
    async AddExpense(req, res, next){
        try{
            const { parentId, parentName, valor, data, categoria, descricao } = req.body;

            const newExpense = await expenses.create({
                parentId,
                parentName,
                valor,
                data,
                categoria,
                descricao
            });

            return res.json(newExpense);

        }catch(error){
            next(error);
        }
    }

    async getExpensePorUsuario(req, res, next){
        try{
            const { parentId } = req.body;

            const expense = await expenses.find({ parentId }).sort({ data: - 1 });

            if(expense.length === 0)
                throw new Error("Nenhuma expense encontrada !");

            return res.json(expense);

        }catch(error){
            next(error);
        }
    }

    async DeleteExpense(req, res, next){
        try{

            const { _id } = req.body;

            const expenseExist = await expenses.findOne( { _id } );

            if(expenseExist === null)
                throw new Error("Expense não encontrada na base de dados");

            await expenses.findByIdAndRemove(expenseExist.id);
            res.json("Expense excluída com sucesso");

        }catch(error){
            next(error);
        }
    };

    async PutExpense(req, res, next){
        try{

            const{ _id } = req.body;

            const expenseExist = await expenses.findOne( { _id } );

            if(expenseExist === null)
                throw new Error("Expense não encontrada na base de dados");

            const data = await expenses.findByIdAndUpdate(expenseExist.id, req.body, {
                new: true,
            })
            
            res.json(data);

        }catch(error){
            next(error);
        }
    };
};

export default new ExpensesController();