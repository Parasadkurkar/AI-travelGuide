import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ItineraryForm from '../components/ItineraryForm';
import ItineraryResult from '../components/ItineraryResult';
import WeatherDisplay from '../components/WeatherDisplay';
import axios from 'axios'; 

function ItineraryBuilderPage() {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [interests, setInterests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState('');
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

 const handleSubmit = async (event) => {
  event.preventDefault();
  setIsLoading(true);
  setError(null);
  setItinerary('');
  setWeather(null); 

  try {
    const response = await fetch('http://localhost:5001/api/generate-itinerary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ destination, duration, interests }),
    });

    if (!response.ok) {
      throw new Error('Something went wrong on the server');
    }

    const data = await response.json();

    if (data.error) {
      setError(data.error);
    } else {
      setItinerary(data.itinerary); 

    
      try {
        const weatherRes = await axios.get('http://localhost:5001/api/weather', {
          params: { destination }
        });
        setWeather(weatherRes.data); // Set weather data
      } catch (weatherError) {
        console.error("Could not fetch weather:", weatherError.message);
        
      }
    }
  } catch (err) {
    console.error('Fetch error:', err);
    setError('Failed to connect to the AI. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  return (
    <Container>
      <Row className="g-4">
        <Col md={6}>
          <ItineraryForm
            handleSubmit={handleSubmit}
            destination={destination}
            setDestination={setDestination}
            duration={duration}
            setDuration={setDuration}
            interests={interests}
            setInterests={setInterests}
            isLoading={isLoading}
          />
        </Col>
        <Col md={6}>
          <ItineraryResult
            isLoading={isLoading}
            error={error}
            itinerary={itinerary}
          />
          
        </Col>
      </Row>
      {weather && (
        <Row className="g-4 mt-1"> 
          {}
          <Col md={12}>
            <WeatherDisplay weatherData={weather} />
          </Col>
        </Row>
      )}
    </Container>
  );
}

export default ItineraryBuilderPage;