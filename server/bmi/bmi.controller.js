import fs from 'fs';
import JSONStream  from 'JSONStream';
import es from 'event-stream';
import bmiModel from './bmi.model';




let BMICategory = [ "Underweight", "Normal weight", "Overweight", "Moderately obese", "Severely obese", "Very severely obese"]

let HealthRisk = ["Malnutrition risk", "Low risk", "Enhanced risk", "Medium risk", "High risk", "Very high risk"];

let getBmiObject = (bmi) => {
  let bmiObject = {};
  
  if(bmi<=18.4) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[0];
    bmiObject.healthRisk = HealthRisk[0];
  }
  if(18.5<=bmi && bmi<=24.9) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[1];
    bmiObject.healthRisk = HealthRisk[1];
  }
  if(25<=bmi && bmi<=29.9) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[2];
    bmiObject.healthRisk = HealthRisk[2];
  }
  if(30<=bmi && bmi<=34.9) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[3];
    bmiObject.healthRisk = HealthRisk[3];
  }
  if(35<=bmi && bmi<=39.9) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[4];
    bmiObject.healthRisk = HealthRisk[4];
  }
  if(bmi>=40) {
    bmiObject.bmi = bmi;
    bmiObject.bmiCategory = BMICategory[5];
    bmiObject.healthRisk = HealthRisk[5];
  }

  return bmiObject
}


let processedDataArrayForBulkUpload = [];
let totalOverWeightMale = 0;
let totalOverWeightFemale = 0;

/**
 * 
 * @param {req will contain the path to the json} req 
 * @param {success or failure based on the processing. On success response will be succss message and overweight metric.} res 
 */
export const processdata = async (req, res) => {

  try {
    /**before starting the json processing cleaning up the database*/
  await bmiModel.deleteMany();


  let jsonPath = req.body.jsonPath;
  getjsonStream(jsonPath).pipe(es.mapSync((data) => {

    let bmi = data.WeightKg / ((data.HeightCm / 100) * (data.HeightCm / 100));
    bmi = Math.round((bmi + Number.EPSILON) * 10) / 10;
    processedDataArrayForBulkUpload.push(getBmiObject(bmi));
    maitainOverWeightPersonCount(getBmiObject(bmi), data['Gender']);
    return data
  })).on('end', function () {
    bmiModel.insertMany(processedDataArrayForBulkUpload);
    res.json({ "message": "data process successfully", totalOverWeightMetric: { totalOverWeightFemale: totalOverWeightFemale, totalOverWeightMale: totalOverWeightMale } });
  }).on('error', function (err) {
    // handle any errors
    logger.error(`error detected - ${err}`)

  });
} catch(e) {

  logger.error(`error detected - ${e}`)
  res.status(500).json({"message": "server error"})
}
}


/**
 * 
 * @param {path to the json} jsonPath 
 * @returns {each parsed object}
 */
let getjsonStream = (jsonPath) => {

  let jsonStream = fs.createReadStream(`${jsonPath ? jsonPath : "./data/bfi.json"}`,{ encoding: 'utf8' });
  let parser = JSONStream.parse('*');
  return jsonStream.pipe(parser);

}

let maitainOverWeightPersonCount = (bmiObject, gender) => {
    if(gender == 'Female' && bmiObject.bmiCategory=="Overweight"){
      totalOverWeightFemale++;
      logger.info(`totalOverWeightFemale - ${totalOverWeightFemale}`);
    }

    if(gender == 'Male' && bmiObject.bmiCategory=="Overweight"){
      totalOverWeightMale++;
      logger.info(`totalOverWeightMale - ${totalOverWeightMale}`);
    }
}
