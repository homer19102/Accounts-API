import { db } from '../../databaseConnect.js';

const Accounts = db.accounts;

class ValidConta{
    async validaConta(conta, next) {
        try{
            conta = {
                conta
            };
            conta = await Accounts.findOne(conta);

            if(!conta)
                throw new Error("Conta não encontrada na base de dados !");

            return conta;
            
        }catch(error){
            next(error);
        }
    };
};

export default new ValidConta();