import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';
import mailer from '../modules/mailer.js';
import { format } from 'date-fns';
import StringFormat from '../utils/StringFormat.js';

const expenses = db.expenses;
const Accounts = db.accounts;

class BalancerController{
    async Transferencia(req, res, next){
        try{

            const {conta, contaDestino, valor, data} = req.body;

            const dateFormat = format(new Date(), "yyyy-MM-dd HH:mm:ss");

            const formatValue = valor.toLocaleString('pt-br', {minimumFractionDigits: 2});

            if(conta === contaDestino)
                throw new Error("O usuário inicial não pode ser o mesmo de destino, favor verificar o dado digitado !");

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

            contaInicial.saldo = (Math.round(contaInicial.saldo  * 100) / 100);
            contaDestinoo.saldo = (Math.round(contaDestinoo.saldo  * 100) / 100);

            contaInicial = new Accounts(contaInicial);
            contaInicial.save();

            contaDestinoo = new Accounts(contaDestinoo);
            contaDestinoo.save();

                //cria despesa negativa para o usuário que está transferindo o dinheiro para o usuário
            const newExpenseNegative = await expenses.create({
                parentId : contaInicial._id,
                parentName : contaInicial.filterName,
                valor : valorNegativo,
                data : dateFormat,
                categoria : "Receita",
                descricao: "Transferência",
                targetUser: contaDestinoo.filterName
            });

            //cria despesa positiva para quem está recendo a quantia
            const newExpensePositive = await expenses.create({
                parentId : contaDestinoo._id,
                parentName : contaDestinoo.filterName,
                valor : valor,
                data : dateFormat,
                categoria : "Receita",
                descricao: "Transferência",
                targetUser : contaInicial.filterName
            });

    // Somente descomentar para a apresentação do projeto
             await mailer.sendMail({
                to: contaInicial.email,
                from: "no-reply@victornfb.com",
                subject: "QuickBank - Transferência Realizada Com Sucesso",
                template: "auth/transfer",
                context: { user: contaInicial.filterName,
                    destinyUser: contaDestinoo.filterName,
                    name: contaDestinoo.name,
                    document: StringFormat.ReplaceCharacter(4,10,StringFormat.FormatCpf(contaDestinoo.cpf), '*'),
                    value: formatValue,
                    link: process.env.LINK,
                    textOne: 'Sua transferência de',
                    textTwo: 'para',
                    textThree: 'foi realizada com sucesso.'
                    },
            }) 

            await mailer.sendMail({
                to: contaDestinoo.email,
                from: "no-reply@victornfb.com",
                subject: "QuickBank - Transferência Recebida",
                template: "auth/transfer",
                context: { user: contaDestinoo.filterName,
                    destinyUser: contaInicial.filterName,
                    name: contaInicial.name,
                    document: StringFormat.ReplaceCharacter(4,10,StringFormat.FormatCpf(contaInicial.cpf), '*'),
                    value: formatValue,
                    link: process.env.LINK,
                    textOne: 'Você recebeu uma transferência de ',
                    textTwo: 'de',
                    textThree: ' '
                    },
            }) 

            const saldoFormatado = contaInicial.saldo.toLocaleString('pt-br', {minimumFractionDigits: 2})

            return res.json("Transferência efetuada com sucesso para " + `${contaDestinoo.name } ` + "seu saldo atual é R$ " + `${saldoFormatado}`);

        }catch(error){
            next(error);
        }
    }
}



export default new BalancerController();