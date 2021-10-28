import { db } from '../../databaseConnect.js';
import ValidConta from '../utils/ValidConta.js';

const goals = db.goals;
const Accounts = db.accounts;

class GoalsController {

    async GetGoals(req, res ,next){
        try{

            const userId = req.params.userId;

            const userExists = await Accounts.findOne( {_id : userId });

            if(userExists === null)
                throw new Error("Usuário não encontrado na base de dados !");

            const goalsUser = await goals.find({ parentId : userId }).sort({ data: - 1 });

            return res.json(goalsUser);

        }catch(error){
            next(error);
        }
    };

    async PostGoal(req, res, next){
        try{

            const { parentId, parentName, nameGoal, valueGoal} = req.body;

            let currentGoalValue = 0;

            const value = Math.sign(valueGoal);

            if(value === -1 || value === 0)
                throw new Error("O valor da meta não pode ser negativo !");

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
            
            if(contaExist.id !== goalExists.parentId)
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

    async GetGoal(req, next){
        try{

            const { goalId, parentId } = req.body;

            const goalExist = await goals.findOne( { _id : goalId, parentId : parentId });

            if(!goalExist)
                throw new Error("Meta não encontrada na base de dados !");

            
            return goalExist;

        }catch(error){
            next(error);
        }
    }

    async PutValueGoal(req, res, next){
        try{

            const { goalId, valor } = req.body;

            let goal =  await goals.findOne( { _id : goalId });

            if(!goal)
                throw new Error("Goal não encontrada na base de dados !");

            const tipoValor = Math.sign(valor);

            if(tipoValor === -1 || tipoValor === 0)
                throw new Error("O valor não pode ser negativo ou zero !");

            if(goal.valueGoal === valor)
                throw new Error("O valor a ser atualizado deve ser diferente do valor atual da meta ! ");

            goal.valueGoal = valor;

            goal = new goals(goal);

            goal.save();

            res.json("Valor da meta atualizado com sucesso !");

        }catch(error){
            next(error);
        }
    }

    async PostRemoveValueGoal(req, res, next){
        try{
            const { goalId, userId, valor } = req.body;

            if(valor <= 0)
                throw new Error("O valor informado deve ser maior que 0 !");

            let goal = await goals.findOne( { _id: goalId });
            let conta  = await Accounts.findOne( { _id: userId } ); 
            
            if(!goal)
                throw new Error("Goal não encontrada na base de dados !");

            if(!conta)
                throw new Error("Conta não encontrada na base de dados !");

            if(conta.id !== goal.parentId)
                throw new Error("A conta a ser creditada não pertence ao usuário !");

            if(goal.currentGoalValue < valor)
                throw new Error("O valor a ser retirado da meta excede o valor diponível favor verificar o dado digitado !");

            conta.saldo += valor;

            goal.currentGoalValue -= valor;

            goal.currentGoalValue = (Math.round(goal.currentGoalValue * 100) / 100);

            conta = new Accounts(conta);
            goal = new goals(goal);

            conta.save();
            goal.save();

            return res.json("Valor removido da meta com sucesso ! ");

        }catch(error){
            next(error);
        }
    }
};

export default new GoalsController();