export default (mongoose) => {
    const schema = mongoose.Schema({
        parentId:{
            type: String,
            required: true
        },
        parentName:{
            type: String,
            required: true,
        },
        valor:{
            type: Number,
            required: true
        },
        data:{
            type: String,
            required: true
        },
        categoria:{
            type: String,
            required: true,
        },
        descricao:{
            type: String,
            required: true,
        },
        targetUser:{
            type: String,
        }
    })

    const expensesSchema = mongoose.model('expenses', schema,'expenses');

    return expensesSchema;
};