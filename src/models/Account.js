
export default(mongoose) =>{
    const schema = mongoose.Schema({
        name:{
            type: String,
            required: true
        },
        filterName:{
            type: String,
        },
        senha:{
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
        metas:[{
            NomeMeta: String,
            ValorMeta: Number
        }],
        email:{
            type: String,
            required: true
        },
        compra:[{
            valor: Number,
            categoria: String
        }]
    });

    const accountsSchema = mongoose.model('Accounts', schema,'Accounts');

    return accountsSchema;
};