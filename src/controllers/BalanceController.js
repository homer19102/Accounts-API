import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';

const Accounts = db.accounts;

class BalancerController{
    async Transferencia(req, res, next){
        try{

            const {conta, contaDestino, valor} = req.body;
            let contaInicial = await ValidConta.validaConta(conta, next);
            let contaDestinoo = await ValidConta.validaConta(contaDestino, next);

            contaInicial.saldo -= valor;
            if(contaInicial.saldo < 0){
                throw new Error("Saldo insuficiente para completar a operação !");
            }

            contaDestinoo.saldo += valor;

            contaInicial = new Accounts(contaInicial);
            contaInicial.save();

            contaDestinoo = new Accounts(contaDestinoo);
            contaDestinoo.save();

            return res.json("Transferência efetuada com sucesso para " + `${contaDestinoo.name } ` + "seu saldo atual é " + `${contaInicial.saldo}`);

        }catch(error){
            next(error);
        }
    }
}



export default new BalancerController();