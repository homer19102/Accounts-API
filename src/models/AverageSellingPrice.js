export default (mongoose) =>{
    const Schema = mongoose.Schema
    const schema = mongoose.Schema({
        propertyId: {
            type : String,
            required: true
        },
        propertyIdObject: {
            type: Schema.Types.ObjectId,
            required: true
        },
        oneYear:{
            type: Number,
            required: true
        },
        twoYear:{
            type: Number,
            required: true
        },
        threeYear:{
            type: Number,
            required: true
        },
        fourYear:{
            type: Number,
            required: true
        },
        fiveYear:{
            type: Number,
            required: true
        },
        sixYear:{
            type: Number,
            required: true
        },
        sevenYear:{
            type: Number,
            required: true
        },
        eightYear:{
            type: Number,
            required: true
        },
        nineYear:{
            type: Number,
            required: true
        },
        tenYear:{
            type: Number,
            required: true
        }
     });

     const averageSellingPriceSchema = mongoose.model('AverageSellingPrice', schema,'AverageSellingPrice');

     return averageSellingPriceSchema;
}