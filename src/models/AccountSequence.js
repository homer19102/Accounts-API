export default(mongoose) =>{
    const schema = mongoose.Schema({
       agencia: {
           type : String
       },
       conta: {
           type: Number
       }
    });

    const accountSequenceSchema = mongoose.model('AccountSequence', schema,'AccountSequence');

    return accountSequenceSchema;
};