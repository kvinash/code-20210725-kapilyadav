
'use strict';
const _ = require('lodash');
// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // MongoDB connection options
  mongo: {
      uri:
    'mongodb+srv://bmiindex:c2RF63Df0FNL2rLw@cluster0.2hm3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  },
    options: {
   
      poolSize : 15,
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(all);
