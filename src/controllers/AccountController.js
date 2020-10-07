import { db } from '../../databaseConnect.js';
import bcrypt from 'bcrypt';
import ValidEmail from '../utils/ValidEmail.js';

const Accounts = db.accounts;
const AccountsSequence = db.accountSequence;

class AccountController{
    async getAccount(req, res, next){
        try{
            const { cpf } = req.body;

            const cpfExists = await Accounts.find({ cpf });
    
            if(cpfExists.length === 0)
                throw new Error("Usuário inexistente para o CPF " +  `${cpf}`);

            return res.json(cpfExists);
        }catch(error){
            next(error);
        }
    }

    async createAccount(req, res, next){
        try{
            const {name, senha, cpf , email, saldo, userFilter} = req.body;

            let validEmail2 = await ValidEmail.validEmail(email);

            if(!validEmail2)
                throw new Error("E-mail informado está fora do padrão ! Tente novamente");

            let filterName = `${"@"}${userFilter}`;

            const password = await bcrypt.hash(senha, 10);

            const accountExists = await Accounts.findOne( { cpf });

            const userExists = await Accounts.findOne ( { filterName : filterName } );

            const emailExists = await Accounts.findOne ( { email } );

            let sequence = await AccountsSequence.findOne();
            
            if(accountExists !== null)
                throw new Error("Usuário já existente para o CPF " +  `${cpf}`);

            if(userExists !== null)
                throw new Error("Nome de usuário já cadastrado " +  `${filterName}`);

            if(emailExists !== null)
                throw new Error("O email informando já possui cadastro " +  `${email}`);
    
            if(accountExists === null){
                const newAccount = await Accounts.create({
                    name,
                    filterName,
                    password,
                    cpf,
                    email,
                    agencia : sequence.agencia,
                    conta : sequence.conta,
                    saldo
                });

                sequence.conta++

                sequence = new AccountsSequence(sequence);
            
                sequence.save();
                
                return res.json(newAccount);
            }
        }catch(error){
            next(error);
        }
    }

    async delete(req,res, next){

        try{
            const {cpf} = req.body;

            const cpfExists = await Accounts.findOne({cpf});
            
            if(cpfExists === null)
                throw new Error("Usuário inexistente para o CPF " +  `${cpf}`);
    
            if(cpfExists !== null){
                await Accounts.findByIdAndRemove(cpfExists.id);
                res.json("Usuário excluido com sucesso");
            }
        }catch(error){
            next(error);
        }
       
    }

    async update(req, res, next){
        try{
            const { cpf } = req.body;
            
            const cpfExists = await Accounts.findOne({cpf});

            if(cpfExists === null)
                throw new Error("Usuário inexistente para o CPF " +  `${cpf}`);

            const data = await Accounts.findByIdAndUpdate(cpfExists.id, req.body,{
            new: true,
        });

        res.json(data); 

        }catch(error){
            next(error);
        }
        
    }
}


export default new AccountController();
