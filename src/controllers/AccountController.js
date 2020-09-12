import { db } from '../../databaseConnect.js';
import {promises as fs} from "fs";

const { readFile , writeFile } = fs;

const Accounts = db.accounts;

global.fileName = "sequence.json";

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
            const {name, senha, cpf , email, saldo} = req.body;

            const data = JSON.parse(await readFile( global.fileName ))

            let filterName = `${"@"}${name}`;

            let conta = data.conta++;

            let agencia = data.agencia;            
            
            const accountExists = await Accounts.findOne( { cpf });

            if(accountExists !== null)
                throw new Error("Usuário já existente para o CPF " +  `${cpf}`);
    
            if(accountExists === null){
                const newAccount = await Accounts.create({
                    name,
                    filterName,
                    senha,
                    cpf,
                    email,
                    agencia,
                    conta,
                    saldo
                });

                await writeFile(global.fileName, JSON.stringify(data, null, 2));

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
