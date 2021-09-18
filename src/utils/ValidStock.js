import { db } from '../../databaseConnect.js';

const Stocks = db.stockmarketplace;

class ValidStock{
    async ValidaStock(idStock, next){
        try{

            let stock = await Stocks.findOne({ _id : idStock});

            if(!stock)
                throw new Error("Stock não encontrada na base de dados !");

            return stock;

        }catch(error){
            next(error);
        }
    }
}

export default new ValidStock();