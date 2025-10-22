// Import the Express library
const express = require("express");
const cors = require("cors");
require("dotenv").config();
// console.log("My API Key is:", process.env.GEMINI_API_KEY);
// --- ADDED: Google Gemini AI Setup ---
const { GoogleGenerativeAI } = require("@google/generative-ai");
const mongoose = require('mongoose');
const Trip = require('./models/Trip');
const axios = require('axios');

// Initialize the Generative AI client with the API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Get the specific model we want to use
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// Create an instance of an Express application
const app = express();

// Define the port the server will run on
// Use 5001 as an example. We can change this later.
const port = 5001;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

// Define a simple "GET" route for the homepage
// This is just to test if our server is working
app.get("/", (req, res) => {
  // Send a JSON object instead of just text
  res.json({ message: "Hello from the AI Travel Guide Backend!" }); // <-- UPDATE THIS LINE
});

// Test Route (keep this to check if the server is alive)
app.get("/", (req, res) => {
  res.json({ message: "Hello from the AI Travel Guide Backend!" });
});

// --- ADDED: AI Itinerary Generation Route ---
app.post("/api/generate-itinerary", async (req, res) => {
  console.log("Received request for itinerary:");
  console.log(req.body);

  try {
    // Get user preferences from the request body
    // We'll send { destination, duration, interests } from our React app
    const { destination, duration, interests } = req.body;

    // --- Create a detailed prompt for the AI ---
    const prompt = `
  You are an expert travel guide.
  Create a personalized travel itinerary for the following preferences:
  - Destination: ${destination}
  - Travel Duration: ${duration} days
  - Main Interests: ${interests}

  Format the response as a single, valid JSON object.
  The JSON object must have a single key: "itinerary".
  The value of "itinerary" should be an array of "day" objects.
  Each "day" object should have two keys:
  1. "day": A string (e.g., "Day 1").
  2. "activities": An array of "activity" objects.
  Each "activity" object should have two keys:
  1. "title": A short, bold-sounding title for the activity (e.g., "Colosseum and Roman Forum").
  2. "description": A 1-2 sentence description of the activity.

  Do not include any text, greetings, or explanations outside of the JSON object.
  The entire response must be only the JSON.
`;

    // --- Send the prompt to the AI model ---
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const itineraryText = await response.text();

    console.log("AI Response:", itineraryText);

    let itineraryJSON;
    try {
      // 1. Find the first '{' (start of JSON)
      const jsonStartIndex = itineraryText.indexOf("{");
      // 2. Find the last '}' (end of JSON)
      const jsonEndIndex = itineraryText.lastIndexOf("}");

      if (jsonStartIndex === -1 || jsonEndIndex === -1) {
        // If we can't find a JSON object, throw an error
        throw new Error("Could not find valid JSON object in AI response.");
      }

      // 3. Extract the clean JSON string
      const jsonString = itineraryText.substring(
        jsonStartIndex,
        jsonEndIndex + 1
      );

      // 4. Parse the extracted string
      itineraryJSON = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", parseError);
      console.error("AI response that failed was:", itineraryText);
      // This tells the frontend the AI messed up the formatting
      throw new Error("AI returned a malformed response.");
    }

    // --- Send the AI-generated text back to the frontend ---
    res.json(itineraryJSON);
  } catch (error) {
    console.error("Error generating itinerary:", error);
    res
      .status(500)
      .json({ error: "Failed to generate itinerary. Please try again." });
  }
});
// --- End of New Route ---

// --- ADDED: Suggested Trips Routes ---

// --- GET Route: Get all suggested trips ---
app.get('/api/trips', async (req, res) => {
  try {
    // Find all trips in the database and sort them by creation date
    const trips = await Trip.find({}).sort({ createdAt: -1 });
    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching trips:', error.message);
    res.status(500).json({ error: 'Failed to fetch suggested trips.' });
  }
});

// --- POST Route: Add a new suggested trip ---
app.post('/api/trips', async (req, res) => {
  // Get the new data structure from the request body
  const { name, description, location, type, comments, coordinates } = req.body;

  try {
    // Create a new trip document with all the new fields
    const newTrip = await Trip.create({ 
      name, 
      description, 
      location, 
      type, 
      comments, 
      coordinates 
    });
    res.status(201).json(newTrip); // Send back the newly created trip
  } catch (error) {
    console.error('Error creating trip:', error.message);
    res.status(400).json({ error: 'Failed to create new trip. Check all fields.' });
  }
});

// --- End of New Routes ---
// --- NEW Dynamic Suggested Trips Route (from RapidAPI) ---

app.get('/api/dynamic-trips', async (req, res) => {
  
  const options = {
    method: 'POST',
    url: 'https://travel-guide-api-city-guide-top-places.p.rapidapi.com/check',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY, 
      'X-RapidAPI-Host': 'travel-guide-api-city-guide-top-places.p.rapidapi.com'
    },
    data: {
      region: 'London',
      language: 'en',
      interests: ['historical', 'cultural', 'food', 'nature']
    }
  };

  try {
    // Make the API call
    const response = await axios.request(options);
    
    // Get the array of attractions from the 'result' key
    const attractions = response.data.result;

    // Send the original, full array to the frontend
    res.status(200).json(attractions);

  } catch (error) {
    if (error.response) {
      console.error('RapidAPI Error:', error.response.data);
    } else {
      console.error('Error fetching dynamic trips:', error.message);
    }
    res.status(500).json({ error: 'Failed to fetch dynamic trips.' });
  }
});

// --- ADDED: OpenWeatherMap Route ---

app.get('/api/weather', async (req, res) => {
  // Get the destination from the query string (e.g., /api/weather?destination=London)
  const { destination } = req.query;

  if (!destination) {
    return res.status(400).json({ error: 'Destination query parameter is required.' });
  }

  // The OpenWeatherMap API URL
  const url = `https://api.openweathermap.org/data/2.5/weather`;

  // Parameters for the API call
  const options = {
    params: {
      q: destination, // The city name
      appid: process.env.WEATHER_API_KEY, // Your secret API key
      units: 'metric' // Use 'imperial' for Fahrenheit
    }
  };

  try {
    // Use axios to call the API
    const response = await axios.get(url, options);

    // Send the data from OpenWeatherMap back to our frontend
    res.status(200).json(response.data);

  } catch (error) {
    if (error.response) {
      console.error('OpenWeatherMap Error:', error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error('Error fetching weather:', error.message);
      res.status(500).json({ error: 'Failed to fetch weather data.' });
    }
  }
});

// --- End of New Weather Route ---

// Start the server and listen for incoming connections
mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI)
  .then(() =>{
      console.log(' !!connected to MongoDB');

      app.listen(port ,() =>{
        console.log(`Backend Server is Runnning on port http://localhost:${port}`);
      });
  })
  .catch((err) =>{
    console.error('Failed to Connect to MONGODB');
    console.log(err);
  });
