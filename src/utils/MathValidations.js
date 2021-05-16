class MathValidations{
     NegativeValue(value, next) {
        try{
            return -Math.abs(value);
        }catch(error){
            next(error);
        }
    };

    FormatDecimal(value, houses){
        const og = Math.pow(10, houses)
        return Math.floor(value * og) / og;
    }
};

export default new MathValidations();