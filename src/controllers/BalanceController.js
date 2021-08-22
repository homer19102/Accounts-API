import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';

const expenses = db.expenses;
const Accounts = db.accounts;

class BalancerController{
    async Transferencia(req, res, next){
        try{

            const {conta, contaDestino, valor, data} = req.body;

            if(conta === contaDestino)
                throw new Error("O usuário inicial não pode ser o mesmo de destino, favor verificar o dados digitado !");

            let contaInicial = await ValidConta.validaConta(conta, next);
            let contaDestinoo = await ValidConta.validaConta(contaDestino, next);

            const tipoExpense = Math.sign(valor);

            if(tipoExpense === -1 || tipoExpense === 0)
                throw new Error("O valor não pode ser negativo ou zero !");

            let valorNegativo = valor * -1;
            contaInicial.saldo -= valor;
            if(contaInicial.saldo < 0){
                throw new Error("Saldo insuficiente para completar a operação !");
            }

            contaDestinoo.saldo += valor;

            contaInicial = new Accounts(contaInicial);
            contaInicial.save();

            contaDestinoo = new Accounts(contaDestinoo);
            contaDestinoo.save();

                //cria despesa negativa para o usuário que está transferindo o dinheiro para o usuário
            const newExpenseNegative = await expenses.create({
                parentId : contaInicial._id,
                parentName : contaInicial.filterName,
                valor : valorNegativo,
                data : data,
                categoria : "Receita",
                descricao: "Transferência",
                targetUser: contaDestinoo.filterName
            });

            //cria despesa positiva para quem está recendo a quantia
            const newExpensePositive = await expenses.create({
                parentId : contaDestinoo._id,
                parentName : contaDestinoo.filterName,
                valor : valor,
                data : data,
                categoria : "Receita",
                descricao: "Transferência",
                targetUser : contaInicial.filterName
            });

            return res.json("Transferência efetuada com sucesso para " + `${contaDestinoo.name } ` + "seu saldo atual é " + `${contaInicial.saldo}`);

        }catch(error){
            next(error);
        }
    }
}



export default new BalancerController();