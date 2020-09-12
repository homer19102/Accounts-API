import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';

const goals = db.goals;
const Accounts = db.accounts;

class GoalsController {
    async PostGoal(req, res, next){
        try{

            const { parentId, parentName, nameGoal, valueGoal} = req.body;

            let currentGoalValue = 0;

            const newGoal = await goals.create({
                parentId,
                parentName,
                nameGoal,
                valueGoal,
                currentGoalValue
            });

            return res.json(newGoal);

        }catch(error){
            next(error);
        }
    }
    
    async PutTransferToGoal(req, res, next){
        try{

            const { _id, value, conta} = req.body;

            if(value <= 0)
                throw new Error("O valor informado deve ser maior que 0 !");
            
                
            let goalExists = await goals.findOne( { _id });

            if(goalExists === null)
                throw new Error("Meta não encontrada na base de dados !");
            
            let contaExist = await ValidConta.validaConta(conta, next);

            contaExist.saldo -= value;

            if(contaExist.saldo < 0)
                throw new Error("Saldo insuficiente para executar a ação !");
            
            goalExists.currentGoalValue += value;

            contaExist = new Accounts(contaExist);
            contaExist.save();

            goalExists = new goals(goalExists);
            goalExists.save();

            return res.json("Transferência de " + `${ value } ` + "efetuada com sucesso para a meta " + ` ${ goalExists.nameGoal } `);
            

        }catch(error){
            next(error);
        }
    }
};

export default new GoalsController();