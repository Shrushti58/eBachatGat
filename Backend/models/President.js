const mongoose = require('mongoose');

const PresidentSchema = new mongoose.Schema({

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
  members:{
    type:Array,
    default:[]
  },
  treasurers:{
    type:Array,
    default:[]
  },

});

module.exports = mongoose.model('President', PresidentSchema);