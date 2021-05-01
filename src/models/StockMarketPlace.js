export default(mongoose) => {
    const schema = mongoose.Schema({
        propertyType:{
            type: String,
            required: true
        },
        subTypeProperty:{
            type: String,
            required: true
        },
        stockDisplayName:{
            type: String,
            required: true
        },
        stockName:{
            type: String,
            required: true
        },
        constructionYear:{
            type: Number,
            required: true
        },
        builtAreas:{
            type: Number,
            required: true
        },
        totalArea:{
            type: Number,
            required: true
        },
        numberOfUnits:{
            type: Number,
            required: true
        },
        numberOfRequests:{
            type: Number,
            required: true
        },
        stockPrice:{
            type: Number,
            required: true
        },
        propertyMarketValue:{
            type: Number,
            required: true
        },
        numberShares:{
            type: Number,
            required: true
        },
        city:{
            type: String,
            required: true
        },
        state:{
            type: String,
            required: true
        },
        country:{
            type: String,
            required: true
        },
        address:{
            type: String,
            required: true
        },
        zipCode:{
            type: String,
            required: true
        },
        propertyNumber:{
            type: String,
            required: true
        },
        apartmenteNumber:{
            type: String
        },
        recipes:{
            type: Object,
            required: true
        },
        expenditure:{
            type: Object,
            required: true
        },
        startDate:{
            type: String,
            required: true
        },
        finishDate:{
            type: String,
            required: true
        },
        latitude:{
            type: String,
            required: true
        },
        longitude:{
            type: String,
            required: true
        }
    })

    const stockMarketPlaceSchema = mongoose.model('StockMarketPlace', schema,'StockMarketPlace');

    return stockMarketPlaceSchema;
}