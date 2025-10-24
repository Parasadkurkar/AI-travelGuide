const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const coordinateSchema = new Schema({
  latitude: { type: String },
  longitude: { type: String }
}, { _id: false }); 

const tripSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  type: {
    type: String 
  },
  comments: {
    type: String 
  },
  coordinates: coordinateSchema 
}, { timestamps: true }); 


module.exports = mongoose.model('Trip', tripSchema);