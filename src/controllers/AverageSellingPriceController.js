import { db } from '../../databaseConnect.js';

const averageSellingPrice = db.averageSellingPrice;
const stockmarketplace = db.stockmarketplace;

class AverageSellingPrice{
    async PostAverageSellingPrice(req, res, next){

        try{

            const { propertyId } = req.body;

            const averageSellingPriceExist = await averageSellingPrice.findOne( { propertyId : propertyId });
 
            const stock = await stockmarketplace.findOne( { _id : propertyId } );
 
            if(!stock)
                 throw new Error('Stock não encontrada na base de dados !');
     
            if(averageSellingPriceExist)
                throw new Error('Preço médio de venda, já existente para o imóvel');
        
             const newAverageSellingPrice = await averageSellingPrice.create(req.body);
 
             return res.json(newAverageSellingPrice);

        }catch(error){
            next(error);
        }
    }

}

export default new AverageSellingPrice();
