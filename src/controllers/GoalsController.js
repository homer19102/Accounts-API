import { db } from '../../databaseConnect.js';

const goals = db.goals;

class GoalsController {
    async PostGoal(req, res, next){
        try{

            const { parentId, parentName, nameGoal, valueGoal} = req.body;

            const newGoal = await goals.create({
                parentId,
                parentName,
                nameGoal,
                valueGoal
            });

            return res.json(newGoal);

        }catch(error){
            next(error);
        }
    }
};

export default new GoalsController();