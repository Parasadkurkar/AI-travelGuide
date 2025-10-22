import React from 'react';
// Import the components we need
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

function ItineraryResult({ isLoading, error, itinerary }) {
  return (
    <Card className="shadow-sm" style={{ minHeight: '100%' }}>
      <Card.Body>
        <Card.Title as="h2" className="mb-4">Your Personalized Travel Plan</Card.Title>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Communicating with the AI...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert variant="danger">
            <Alert.Heading>Oops!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

        {/* --- NEW: Success State (Itinerary) --- */}
        {/* We check if 'itinerary' is an array and has items */}
        {itinerary && itinerary.length > 0 && (

          // Use an Accordion, 'defaultActiveKey="0"' opens the first day by default
          <Accordion defaultActiveKey="0" alwaysOpen>

            {/* Loop over each 'day' in the itinerary array */}
            {itinerary.map((day, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>

                {/* The Accordion Header is the day title */}
                <Accordion.Header>{day.day}</Accordion.Header>

                {/* The Accordion Body contains the list of activities */}
                <Accordion.Body style={{ padding: '0' }}>
                  <ListGroup variant="flush">

                    {/* Loop over each 'activity' in the day.activities array */}
                    {day.activities.map((activity, actIndex) => (
                      <ListGroup.Item key={actIndex}>
                        <div className="fw-bold">{activity.title}</div>
                        {activity.description}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}

        {/* Default Empty State */}
        {!isLoading && !error && (!itinerary || itinerary.length === 0) && (
          <p className="text-muted">Your generated itinerary will appear here.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default ItineraryResult;