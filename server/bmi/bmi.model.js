import mongoose, { Schema } from 'mongoose';

var BmiSchema = new Schema({

    bmi : {
        type : Number},
    bmiCategory : {
        type : String
    },
    healthRisk : {
        type : String
    }


  
})


export default mongoose.model('bmi', BmiSchema);