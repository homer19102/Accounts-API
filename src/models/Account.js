
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
            required: true
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
        }
    });

    const accountsSchema = mongoose.model('Accounts', schema,'Accounts');

    return accountsSchema;
};