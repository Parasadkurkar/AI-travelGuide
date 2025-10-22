import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

function SuggestedTripsPage() {
  const [trips, setTrips] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // --- THIS IS THE NEW FALLBACK LOGIC ---
    const fetchTrips = async () => {
      setIsLoading(true);
      setError(null);
      
      // --- 1. TRY THE PRIMARY (DYNAMIC) API FIRST ---
      try {
        console.log("Attempting to fetch from dynamic API...");
        const response = await fetch('http://localhost:5001/api/dynamic-trips');
        
        // If response is bad (e.g., 429 Quota Exceeded), throw an error
        if (!response.ok) {
          throw new Error('Dynamic API failed. Status: ' + response.status);
        }
        
        const data = await response.json();
        console.log("Successfully fetched from dynamic API.");
        setTrips(data);
        
      } catch (primaryError) {
        // --- 2. PRIMARY FAILED! TRY THE FALLBACK (DATABASE) API ---
        console.warn(primaryError.message);
        console.log("Attempting to fetch from fallback (database) API...");
        
        try {
          const fallbackResponse = await fetch('http://localhost:5001/api/trips');
          
          if (!fallbackResponse.ok) {
            throw new Error('Fallback API also failed.');
          }
          
          const fallbackData = await fallbackResponse.json();
          console.log("Successfully fetched from fallback API.");
          setTrips(fallbackData);
          
        } catch (fallbackError) {
          // --- 3. BOTH FAILED! SHOW A FINAL ERROR ---
          console.error("All fetch attempts failed:", fallbackError.message);
          setError("Could not load suggested trips. Please try again later.");
        }
      } finally {
        // This runs whether it succeeded or failed
        setIsLoading(false);
      }
    };

    fetchTrips();
  }, []); // The empty array [] means this effect runs only once

  // --- THIS RENDER LOGIC REMAINS EXACTLY THE SAME ---
  // It doesn't care *where* the trips came from.

  // 1. Show loading spinner
  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading trips...</p>
      </Container>
    );
  }

  // 2. Show error message
  if (error) {
    return (
      <Container>
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  // 3. Show trip cards (success)
  return (
    <Container>
      <h2 className="mb-4">Suggested Trips</h2>
      
      <Row xs={1} md={2} lg={3} className="g-4">
        
        {trips.map((trip) => (
          <Col key={trip.name}>
            <Card className="shadow-sm h-100">
              <Card.Body>
                <Card.Title className="fw-bold">{trip.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  <span className="badge bg-info text-capitalize">{trip.type}</span>
                </Card.Subtitle>
                <Card.Text>
                  {trip.description}
                </Card.Text>
              </Card.Body>
              
              {trip.comments && (
                <Card.Footer>
                  <small_ className="text-muted">
                    <strong>Good to know:</strong> {trip.comments}
                  </small_>
                </Card.Footer>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default SuggestedTripsPage;