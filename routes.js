 let routeFun = (app) => {
  // Insert routes below
  app.use('/server/bmi/', require('./api/bmi'));
  
}

module.exports.routeFun = routeFun;
