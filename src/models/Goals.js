export default(mongoose) => {
    const schema = mongoose.Schema({
        parentId:{
            type: String,
            required: true
        },
        parentName:{
            type: String,
            required: true
        },
        nameGoal:{
            type: String,
            required: true
        },
        valueGoal:{
            type: Number,
            required: true
        }
    });

    const goalsSchema = mongoose.model('goals', schema, 'goals');

    return goalsSchema;
};

