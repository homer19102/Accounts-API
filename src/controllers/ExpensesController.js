import { db } from '../../databaseConnect.js';

const expenses = db.expenses;

class ExpensesController {
    async AddCompras(req, res, next){
        try{
            const { parentId, parentName, valor, data, categoria, descricao } = req.body;

            const newCompra = await expenses.create({
                parentId,
                parentName,
                valor,
                data,
                categoria,
                descricao
            });

            return res.json(newCompra);

        }catch(error){
            next(error);
        }
    }

    async getComprasPorUsuario(req, res, next){
        try{
            const { parentId } = req.body;

            const compras = await expenses.find({ parentId }).sort({ data: - 1 });

            if(compras.length === 0)
                throw new Error("Nenhuma expense encontrada !");

            return res.json(compras);

        }catch(error){
            next(error);
        }
    }
};

export default new ExpensesController();