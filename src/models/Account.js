
export default(mongoose) =>{
    const schema = mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        filterName:{
            type: String,
        },
        password:{
            type: String,
        },
        agencia:{
            type: String,
        },
        conta:{
            type: String,
        },
        cpf:{
            type: String,
            required: true
        },
        saldo:{
            type: Number,
        },
        email:{
            type: String,
            required: true
        },
        resetSenhaToken: {
            type: String,
            select: false
        },
        resetSenhaTokenExpiracao: {
            type: Date,
            select: false
        }
    });

    const accountsSchema = mongoose.model('Accounts', schema,'Accounts');

    return accountsSchema;
};