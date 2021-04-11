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

}


export default new StocksController();