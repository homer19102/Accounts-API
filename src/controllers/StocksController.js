import { db } from '../../databaseConnect.js';
import mongoose from 'mongoose';
import MathValidations from '../utils/MathValidations.js';

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

            const stocks = await StockMarketPlace.find().sort({ startDate: - 1 }).lean();

            const dados = [];

            stocks.map(item => {
                dados.push({
                    ...item,
                    stockPrice:  parseFloat(item.stockPrice),
                    dividend: CalculaDividendos(item.estimatedRental, item.stockPrice)
                })
            })

            return res.json(dados);
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
                },
                {
                    $lookup:{
                        from: "AverageSellingPrice", 
                        localField: "_id", 
                        foreignField: "propertyIdObject",
                        as: "average_selling_price"
                    }
                },
            ]);

            if(!stock)
                throw new Error('Stock não encontrada na base de dados !');
            
            const data = [];

            stock.forEach(x => {
                data.push({
                    ...x,
                    stockPrice : parseFloat(x.stockPrice),
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
                    },
                    average_selling_price : {
                        oneYear : x.average_selling_price[0].oneYear,
                        twoYear : x.average_selling_price[0].twoYear,
                        threeYear :  x.average_selling_price[0].threeYear,
                        fourYear :  x.average_selling_price[0].fourYear,
                        fiveYear:  x.average_selling_price[0].fiveYear,
                        sixYear:  x.average_selling_price[0].sixYear,
                        sevenYear:  x.average_selling_price[0].sevenYear,
                        eightYear:  x.average_selling_price[0].eightYear,
                        nineYear:  x.average_selling_price[0].nineYear,
                        tenYear:  x.average_selling_price[0].tenYear,
                    },
                    dividend: CalculaDividendos(x.estimatedRental, x.numberShares),
                  
                })
            })

            return res.json(data);

        }catch(error){
            next(error);
        }
    }

}

function CalculaDividendos(aluguelEstimado, totalDeCotas){
    if(!aluguelEstimado || !totalDeCotas) return null;
    console.log('total de cotas', totalDeCotas)
    var t = parseFloat(totalDeCotas);
    var s  = MathValidations.FormatDecimal((aluguelEstimado / parseFloat(totalDeCotas)), 2);

    return MathValidations.FormatDecimal((aluguelEstimado / totalDeCotas), 2);    
}


export default new StocksController();