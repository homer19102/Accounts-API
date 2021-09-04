import { db } from '../../databaseConnect.js';
import crypto from 'crypto';

const Accounts = db.accounts;

class PasswordController{
    async ResetPassword(req, res, next){

        try{

            const { email } = req.body;

            const userExists = await Accounts.findOne( { email } );
    
            if(!userExists)
                throw new Error("Usuário inexistente !");

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            now.setHours(now.getHours() + 1);

            await Accounts.findByIdAndUpdate(userExists._id, {
                '$set':{
                    resetSenhaToken: token,
                    resetSenhaTokenExpiracao: now
                }
            });


    

        }catch(err){
            next(err);
        }
        
       

    }

}

export default new PasswordController();