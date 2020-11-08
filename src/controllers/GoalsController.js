import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';

const goals = db.goals;
const Accounts = db.accounts;

class GoalsController {

    async GetGoals(req, res ,next){
        try{

            const { parentId } = req.body;

            const userExists = await Accounts.findOne( {_id : parentId });

            if(userExists === null)
                throw new Error("Usuário não encontrado na base de dados !");

            const goalsUser = await goals.find({ parentId }).sort({ data: - 1 });

            return res.json(goalsUser);

        }catch(error){
            next(error);
        }
    };

    async PostGoal(req, res, next){
        try{

            const { parentId, parentName, nameGoal, valueGoal} = req.body;

            let currentGoalValue = 0;

            const userExists = await Accounts.findOne( {_id : parentId });

            if(userExists === null)
                throw new Error("Usuário não encontrado na base de dados !");

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

            if(contaExist._id !== goalExists.parentId)
                throw new Error("A conta a ser debitada não pertence ao usuário !");

            contaExist.saldo -= value;

            if(contaExist.saldo < 0)
                throw new Error("Saldo insuficiente para executar a ação !");
            
            goalExists.currentGoalValue += value;

            contaExist = new Accounts(contaExist);
            
            goalExists = new goals(goalExists);

            contaExist.save();
            goalExists.save();

            return res.json("Transferência de " + `${ value } ` + "efetuada com sucesso para a meta " + ` ${ goalExists.nameGoal } `);
            
        }catch(error){
            next(error);
        }
    }

    async DeleteGoal(req, res, next){
        try{

            const { _id } = req.body;

            const goalExists = await goals.findOne( { _id });

            if(goalExists === null)
                throw new Error("Meta não encontrada na base de dados !");

            const idUser = goalExists.parentId;

            let user = await Accounts.findOne( { _id: idUser });

            const valorAtualMeta = goalExists.currentGoalValue;

            user.saldo += valorAtualMeta;

            user = new Accounts(user);

            await goals.findByIdAndRemove(goalExists);

            user.save();

            res.json("Meta excluída com sucesso");

        }catch(error){
            next(error);
        }
    }
};

export default new GoalsController();