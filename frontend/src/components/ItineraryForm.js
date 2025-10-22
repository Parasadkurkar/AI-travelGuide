import React from 'react';
// Import react-bootstrap components
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function ItineraryForm({ 
  handleSubmit, 
  destination, 
  setDestination, 
  duration, 
  setDuration, 
  interests, 
  setInterests, 
  isLoading 
}) {
  return (
    // Use a Bootstrap Card for a nice container
    <Card className="shadow-sm">
      <Card.Body>
        <Card.Title as="h2" className="mb-5">Create Your Personalized Tour</Card.Title>
        <Form onSubmit={handleSubmit}>
          
          {/* Form Group */}
          <Form.Group className="mb-3" controlId="destination">
            <Form.Label>Destination:</Form.Label>
            <Form.Control
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g., Paris, France"
              required
            />
          </Form.Group>
          
          {/* Form Group */}
          <Form.Group className="mb-3" controlId="duration">
            <Form.Label>Duration (in days):</Form.Label>
            <Form.Control
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="e.g., 5"
              required
            />
          </Form.Group>
          
          {/* Form Group */}
          <Form.Group className="mb-3" controlId="interests">
            <Form.Label>Interests:</Form.Label>
            <Form.Control
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Art, food, and museums"
              required
            />
          </Form.Group>
          
          {/* Submit Button */}
          <div className="d-grid">
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? 'Generating...' : 'Generate Itinerary'}
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default ItineraryForm;