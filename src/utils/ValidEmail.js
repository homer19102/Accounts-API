class IsEmail
{
    async validEmail(email){
        let expression = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if (expression.test(email))
            return true; 
        else
            return false;
    }
};

export default new IsEmail();