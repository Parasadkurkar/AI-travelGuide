const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// --- NEW, RICHER SCHEMA ---

// A small sub-schema for coordinates
const coordinateSchema = new Schema({
  latitude: { type: String },
  longitude: { type: String }
}, { _id: false }); // _id: false stops Mongoose from creating IDs for sub-docs

// The main trip schema, matching our new data
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
    type: String // e.g., "historical", "cultural", "food"
  },
  comments: {
    type: String // e.g., "Good to know: Arrive early..."
  },
  coordinates: coordinateSchema // This will be the nested { lat, lon } object

}, { timestamps: true }); // 'timestamps' adds 'createdAt' and 'updatedAt'


module.exports = mongoose.model('Trip', tripSchema);