const mongoose = require('mongoose');

const TreasurerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  email:{type:String,
    required:true
  },
  password:{type:String,
  required:true,},
  image:Buffer,
});

module.exports = mongoose.model('Treasurer', TreasurerSchema);
