import { db } from '../../databaseConnect.js';
import bcrypt from 'bcrypt';

const Accounts = db.accounts;

class LoginController {
    async Login(req, res, next){
        try{

            const { cpf, senha } = req.body;

            const userExists = await Accounts.findOne( { cpf } );

            if(userExists === null)
                throw new Error("Usuário não encontrado na base de dados !");

            if(await bcrypt.compare(senha, userExists.password))
                return res.json({
                    _id : userExists._id,
                    name : userExists.name,
                    filterName : userExists.filterName,
                    cpf : userExists.cpf,
                    email : userExists.email,
                    agencia : userExists.agencia,
                    conta : userExists.conta,
                    saldo : userExists.saldo
                });
            else{
                throw new Error("Senha ou usuário incorretos !");
            }
        }catch(error){
            next(error);
        }
    }
}


export default new LoginController();

