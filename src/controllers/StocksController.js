import { db } from '../../databaseConnect.js';

const StockMarketPlace = db.stockmarketplace;

class StocksController{
    async PostStock(req, res, next){

        try{

            const newStock = await StockMarketPlace.create(req.body);

            return res.json(newStock);

        }catch(error){
            next(error)
        }

    }

     async GetStocks(req, res, next){
        try{

            const stocks = await StockMarketPlace.find().sort({ startDate: - 1 });

            return res.json(stocks);
        }catch(error){
            next(error);
        }
    }

    async GetStock(req, res, next){
        try{

            const stockId = req.params.stockId;

            const stockExist = await StockMarketPlace.findOne( {_id : stockId });

            if(!stockExist)
                throw new Error('Stock não encontrada na base de dados !');

            return res.json(stockExist);

        }catch(error){
            next(error);
        }
    }

}


export default new StocksController();