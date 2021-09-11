import { db } from '../../databaseConnect.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const Accounts = db.accounts;

class LoginController {
    async Login(req, res, next){
        try{

            const { usuario, senha } = req.body;

            const userExists = await Accounts.findOne( { filterName: usuario } );

            if(userExists === null)
                throw new Error("Usuário não encontrado na base de dados !");

            
            if(!await bcrypt.compare(senha, userExists.password))
                throw new Error("Senha ou usuário incorretos !");

            const token = jwt.sign( { id: userExists._id }, process.env.SECRET, {
                expiresIn: 3600,
            });

            const refreshToken = jwt.sign( { id: userExists.id }, process.env.REFRESHTOKENSECRET, {
                expiresIn: 604800,
            });


            res.cookie('refreshToken', refreshToken);
            res.cookie('user', userExists._id);

            res.json({
                 _id : userExists._id,
                 name : userExists.name,
                 filterName : userExists.filterName,
                 cpf : userExists.cpf,
                 email : userExists.email,
                 agencia : userExists.agencia,
                 conta : userExists.conta,
                 saldo : userExists.saldo,
                 token: token
            });

            return res;
         
        }catch(error){
            next(error);
        }
    }
}


export default new LoginController();

