import React from 'react';

import { Routes, Route, Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import ItineraryBuilderPage from './pages/ItineraryBuilderPage';
import SuggestedTripsPage from './pages/SuggestedTripsPage';

function App() {
  return (
   
    <div className="App" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {}
      <Navbar bg="primary" variant="dark" expand="lg" className="shadow-sm mb-4">
        <Container>
          
          <Navbar.Brand as={Link} to="/" className="fw-bold">
            AI Travel Guide
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">
                Itinerary Builder
              </Nav.Link>
              <Nav.Link as={Link} to="/suggested-trips">
                Suggested Trips
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Routes>
        
        <Route 
          path="/" 
          element={<ItineraryBuilderPage />} 
        />
        
        <Route 
          path="/suggested-trips" 
          element={<SuggestedTripsPage />} 
        />
      </Routes>
    
      
    </div>
  );
}

export default App;