import { db } from '../../databaseConnect.js';
import crypto from 'crypto';
import mailer from '../modules/mailer.js';
import bcrypt from 'bcrypt';
import { format } from 'date-fns';
import ValidPassword from '../utils/ValidSenha.js';

const Accounts = db.accounts;

class PasswordController{
    async ResetPassword(req, res, next){

        try{

            const { user } = req.body;

            const userExists = await Accounts.findOne( { filterName: `${"@"}${user}` } );
    
            if(!userExists)
                throw new Error("Usuário inexistente !");

            const token = crypto.randomBytes(20).toString('hex');

            const now = new Date();
            
            now.setHours(now.getHours() + 1);

            const dateFormat = format(now, 'yyyy/MM/dd HH:mm:ss', {
                timeZone: 'America/Sao_Paulo',
              });

            await Accounts.findByIdAndUpdate(userExists._id, {
                '$set':{
                    resetSenhaToken: token,
                    resetSenhaTokenExpiracao: dateFormat
                }
            });

        await mailer.sendMail({
            to: userExists.email,
            from: "no-reply@victornfb.com",
            subject: "Redefinição De Senha QuickBank",
            template: "auth/template",
            context: { userFilterName: userExists.filterName },
        })

        return res.json({ok: "true"});

        }catch(err){
            next(err);
        }
    }
    
    async NewPassword(req, res, next){
        try{

            const { email, senha, token } = req.body;

            const user = await Accounts.findOne( { email } )
                        .select('+resetSenhaToken resetSenhaTokenExpiracao');
            
            if(!user)
                throw new Error('Usuário inexistente');
                

            if(token != user.resetSenhaToken)
                throw new Error('Token inválido');

            const dateNow = new Date();

            const dateFormat = format(dateNow, 'yyyy/MM/dd HH:mm:ss', {
                timeZone: 'America/Sao_Paulo',
              });

            const dateFormatBanco = format(user.resetSenhaTokenExpiracao, 'yyyy/MM/dd HH:mm:ss', {
                timeZone: 'America/Sao_Paulo',
              });


            if(dateFormat > dateFormatBanco)
                throw new Error('Token expirado');

            const passwordValid = await ValidPassword.ValidPassword(senha, next);

            if(!passwordValid)
                throw new Error("A senha deve conter pelo menos 1 número, 1 letra maiúscula, 1 caractere especial, e entre 6 e 16 dígitos tente novamente !");

            const password = await bcrypt.hash(senha, 10);

            user.password = password;

            user.resetSenhaTokenExpiracao = format(dateNow.setHours(dateNow.getHours() - 1), 'yyyy/MM/dd HH:mm:ss', {
                timeZone: 'America/Sao_Paulo',
              });

            await user.save();

            return res.json("Senha alterada com sucesso !");

        }catch(error){
            next(error);
        }
    }

}

export default new PasswordController();