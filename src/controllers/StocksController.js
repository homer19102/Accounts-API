import { db } from '../../databaseConnect.js';
import mongoose from 'mongoose';

const StockMarketPlace = db.stockmarketplace;
const propertyOccupation = db.propertyOccupation;

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

            const ObjectId = mongoose.Types.ObjectId;

            const stockId = req.params.stockId;

            const propertyOccupationExist = await propertyOccupation.findOne( { propertyIdObject : stockId });

            if(!propertyOccupationExist)
                throw new Error('Stock sem dados de ocupação, favor inserir os dados de ocupação !');

            const stock = await StockMarketPlace.aggregate([
                { $match : 
                    {
                        _id : ObjectId(stockId)
                    }
                },
                {
                    $lookup:{
                        from: "PropertyOccupation",     
                        localField: "_id",  
                        foreignField: "propertyIdObject", 
                        as: "property_occupation" 
                    }
                }
            ]);

            if(!stock)
                throw new Error('Stock não encontrada na base de dados !');

            
            const data = [];

            stock.forEach(x => {
                data.push({
                    ...x,
                    property_occupation : {
                        oneYear : x.property_occupation[0].oneYear,
                        twoYear : x.property_occupation[0].twoYear,
                        threeYear :  x.property_occupation[0].threeYear,
                        fourYear :  x.property_occupation[0].fourYear,
                        fiveYear:  x.property_occupation[0].fiveYear,
                        sixYear:  x.property_occupation[0].sixYear,
                        sevenYear:  x.property_occupation[0].sevenYear,
                        eightYear:  x.property_occupation[0].eightYear,
                        nineYear:  x.property_occupation[0].nineYear,
                        tenYear:  x.property_occupation[0].tenYear,
                    }
                  
                })
            })

            return res.json(data);

        }catch(error){
            next(error);
        }
    }

}


export default new StocksController();