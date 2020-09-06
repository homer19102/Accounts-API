import { db } from '../../databaseConnect.js';

const Accounts = db.accounts;
class AccountController{
    async getAccount(req, res){
        const { cpf } = req.body;

        const cpfExists = await Accounts.find({ cpf });

        return res.json(cpfExists);
    }

    async createAccount(req,res){
        try{
            const {name, senha, cpf , email} = req.body;

            let filterName = `${"@"}${name}`;
            
            const accountExists = await Accounts.findOne( { name });
    
            if(accountExists === null){
                const newAccount = await Accounts.create({
                    name,
                    filterName,
                    senha,
                    cpf,
                    email
                });
                return res.json(newAccount);
            }
        }catch(error){
            return res.json(error);
        }
    }

    async delete(req,res){
        const {cpf} = req.body;

        const cpfExists = await Accounts.findOne({cpf});
        
        if(cpfExists !== null){
            await Accounts.findByIdAndRemove(cpfExists.id);
            res.json("Usuário excluido com sucesso");
        }
    }

    async update(req,res){
        const { cpf } = req.body;
        const cpfExists = await Accounts.findOne({cpf});

        const data = await Accounts.findByIdAndUpdate(cpfExists.id, req.body,{
            new: true,
        });

        res.json(data);
    }
}

export default new AccountController();
