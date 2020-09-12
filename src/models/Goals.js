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
        },
        currentGoalValue:{
            type: Number
        }
    });

    const goalsSchema = mongoose.model('goals', schema, 'goals');

    return goalsSchema;
};

