class MathValidations{
     NegativeValue(value, next) {
        try{
            return -Math.abs(value);
        }catch(error){
            next(error);
        }
    };
};

export default new MathValidations();