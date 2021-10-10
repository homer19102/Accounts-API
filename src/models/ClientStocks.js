
export default(mongoose) => {
    const Schema = mongoose.Schema
    const schema = mongoose.Schema({

        parentClientId:{
            type: String,
            required: true
        },
        parentStockIdObject:{
            type: Schema.Types.ObjectId,
            required: true
        },
        parentStockId:{
            type: String,
            required: true
        },
        NumberOfStocks:{
            type: Number,
            required: true
        },
        totalValue:{
            type: Number,
            required: true
        }
    })

    const clientStocksSchema = mongoose.model('ClientStocks', schema, 'ClientStocks');

    return clientStocksSchema;
}