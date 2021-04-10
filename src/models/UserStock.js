export default(mongoose) => {
    const schema = mongoose.Schema({
        parentStockId:{
            type: String,
            required: true
        },
        parentUserId:{
            type: String,
            required: true
        }
    })

    const userStockSchema = mongoose.model('UserStock', schema, 'UserStock');

    return userStockSchema;
}