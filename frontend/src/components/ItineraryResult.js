import React from 'react';
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

        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Communicating with the AI...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">
            <Alert.Heading>Oops!</Alert.Heading>
            <p>{error}</p>
          </Alert>
        )}

 
        {itinerary && itinerary.length > 0 && (

          <Accordion defaultActiveKey="0" >

            {itinerary.map((day, index) => (
              <Accordion.Item eventKey={index.toString()} key={index}>

                <Accordion.Header>{day.day}</Accordion.Header>

                <Accordion.Body style={{ padding: '0' }}>
                  <ListGroup variant="flush">

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

        {!isLoading && !error && (!itinerary || itinerary.length === 0) && (
          <p className="text-muted">Your generated itinerary will appear here.</p>
        )}
      </Card.Body>
    </Card>
  );
}

export default ItineraryResult;