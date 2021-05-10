import { db } from '../../databaseConnect.js';

const Stocks = db.stockmarketplace;

class ValidStock{
    async validaStock(idStock, next){
        try{

            let stock = await Stocks.findOne({ _id : idStock});

            if(!stock)
                throw new Error("Stock não encontrada na base de dados !");

            return stock;

        }catch(error){
            next(error);
        }
    }

    async validaQuantidade(idStock, stockQtd, next){
        try{

           const stock = await Stocks.findOne({ _id : idStock});

           if(stock.numberShares - stock.numberOfRequests < stockQtd)
                throw new Error("A quantidade solicitada para compra excede a quantidade disponível de stocks");
                
        }catch(error){
            next(error);
        }
    }
}

export default new ValidStock();