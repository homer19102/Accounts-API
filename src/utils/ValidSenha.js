class Password
{
    async ValidPassword(pass, next){
        try{

            const regexPassword = /^(?=(?:.*?[A-Z]){2})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

            if(pass.length <= 7)
                throw new Error("A senha deve conter no minímo 7 digitos ! ");

            else if(!regexPassword.exec(pass))
                throw new Error("A senha deve conter no minímo 2 caracteres em maiúsculo, 1 número e um caractere especial");

        }catch(error){
            next(error);
        } 
    }
};
export default new Password();