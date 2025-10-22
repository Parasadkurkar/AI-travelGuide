import React from 'react';
import Card from 'react-bootstrap/Card';

function WeatherDisplay({ weatherData }) {
  // If no weather data, render nothing
  if (!weatherData) {
    return null;
  }

  // Extract the data we want
  const { name, main, weather, wind } = weatherData;
  const temp = main.temp;
  const feelsLike = main.feels_like;
  const description = weather[0].description;
  const icon = weather[0].icon;
  const windSpeed = wind.speed;

  // OpenWeatherMap icon URL
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return (
    <Card className="shadow-sm mt-4">
      <Card.Body>
        <Card.Title as="h3" className="mb-3">Current Weather in {name}</Card.Title>
        <div className="d-flex align-items-center">
          <img src={iconUrl} alt={description} style={{ width: '80px', height: '80px' }} />
          <div>
            <div className="fs-4 fw-bold text-capitalize">{description}</div>
            <div className="fs-5">
              <strong>Temperature:</strong> {temp.toFixed(1)}°C
            </div>
            <div className="text-muted">
              <strong>Feels like:</strong> {feelsLike.toFixed(1)}°C
            </div>
            <div className="text-muted">
              <strong>Wind:</strong> {windSpeed} m/s
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default WeatherDisplay;