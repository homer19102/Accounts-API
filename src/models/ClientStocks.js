
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
        },
        buy_date: {
            type: Date,
            required: true
        },
        sell_date: {
            type: Date,
            required: true
        }
    })

    const clientStocksSchema = mongoose.model('ClientStocks', schema, 'ClientStocks');

    return clientStocksSchema;
}