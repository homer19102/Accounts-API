import { db } from '../../databaseConnect.js';

const propertyOccupation = db.propertyOccupation;
const stockmarketplace = db.stockmarketplace;

class PropertyController{
    async PostPropertyOccupation(req, res, next){

        try{
            const { propertyId } = req.body;

           const propertyOccupationExist = await propertyOccupation.findOne( { propertyId : propertyId });

           const stock = await stockmarketplace.findOne( { _id : propertyId } );

           if(stock)
                throw new Error('Stock não encontrada na base de dados !');
    
           if(propertyOccupationExist)
               throw new Error('Ocupação já existente para o imóvel');
       
            const newPropertyOccupation = await propertyOccupation.create(req.body);

            return res.json(newPropertyOccupation);
    
        }catch(error){
            next(error);
        }
    }
}

export default new PropertyController();