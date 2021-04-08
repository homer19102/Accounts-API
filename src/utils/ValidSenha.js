class Password
{
    async ValidPassword(pass, next){
        try{

            const regexPassword = /^(?=(?:.*?[A-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:;?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%;*(){}_+^&]*$/;

            if(pass.length <= 7 || pass.length >= 16)
                return false;

            else if(!regexPassword.exec(pass))
                return false;
            
            return true;

        }catch(error){
            next(error);
        } 
    }
};
export default new Password();