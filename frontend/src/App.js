import React from 'react';
// --- Import React Router components ---
import { Routes, Route, Link } from 'react-router-dom';

// --- Import Bootstrap Nav components ---
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// --- Import our new Page components ---
import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import SuggestedTripsPage from './pages/SuggestedTripsPage';

function App() {
  return (
    // Main app container with a light gray background
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* --- START NAVIGATION BAR --- */}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm mb-4">
        <Container>
          {/* Brand/Title - Links to homepage */}
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            AI Travel Guide
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {/* Link to Itinerary Builder Page */}
              <Nav.Link as={Link} to="/">
                Itinerary Builder
              </Nav.Link>
              {/* Link to Suggested Trips Page */}
              <Nav.Link as={Link} to="/suggested-trips">
                Suggested Trips
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/* --- END NAVIGATION BAR --- */}

      {/* --- START ROUTE DEFINITIONS --- */}
      {/* This is where the content for each page will be rendered */}
      <Routes>
        {/* Route 1: Homepage (Itinerary Builder) */}
        <Route 
          path="/" 
          element={<ItineraryBuilderPage />} 
        />
        
        {/* Route 2: Suggested Trips Page */}
        <Route 
          path="/suggested-trips" 
          element={<SuggestedTripsPage />} 
        />
      </Routes>
      {/* --- END ROUTE DEFINITIONS --- */}
      
    </div>
  );
}

export default App;