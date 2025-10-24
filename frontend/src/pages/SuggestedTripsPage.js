import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/autoplay';

function SuggestedTripsPage() {

  const [trips, setTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  const [selectedTrip, setSelectedTrip] = useState(null);
  
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    const fetchTrips = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('https://travelguideserver.onrender.com/api/dynamic-trips');
        if (!response.ok) throw new Error('Dynamic API failed');
        const data = await response.json();
        setTrips(data);
      } catch (primaryError) {
        console.warn(primaryError.message, "Falling back to local DB.");
        try {
          const fallbackResponse = await fetch('https://travelguideserver.onrender.com/api/trips');
          if (!fallbackResponse.ok) throw new Error('Fallback API also failed');
          const fallbackData = await fallbackResponse.json();
          setTrips(fallbackData);
        } catch (fallbackError) {
          setError("Could not load suggested trips. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);


  const handleCardClick = (trip) => {
    if (swiperInstance) swiperInstance.autoplay.stop(); 
    setSelectedTrip(trip); 
  };

  const handleModalClose = () => {
    setSelectedTrip(null); 
    if (swiperInstance) swiperInstance.autoplay.start(); 
  };



  if (isLoading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Loading trips...</p>
      </Container>
    );
   }
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


  return (
<Container> {}
      <h2 className="mb-4 text-center">Suggested Trips</h2>
      
      {}
      <div className="swiper-container-wrapper">
        <Swiper
          modules={[EffectCoverflow, Autoplay]}
          effect="coverflow"
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={'auto'}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          coverflowEffect={{
            rotate: 30,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          onSwiper={setSwiperInstance}
          className="my-swiper-slider"
        >
          {trips.map((trip) => (

            <SwiperSlide key={trip.name}>
              {({ isActive }) => (
                <Card
                  className={`shadow-sm h-100 ${isActive ? 'active-slide' : ''}`}
                  onClick={() => isActive && handleCardClick(trip)}
                  style={{ cursor: isActive ? 'pointer' : 'default' }}
                >
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
                      <small className="text-muted">
                        <strong>Good to know:</strong> {trip.comments}
                      </small>
                    </Card.Footer>
                  )}
                </Card>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div> {/* 2. END OF WRAPPER DIV */}

      {}
      <Modal show={selectedTrip != null} onHide={handleModalClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedTrip?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { }
          <h5>{selectedTrip?.location}</h5>
          <p><strong>Type:</strong> <span className="badge bg-info text-capitalize">{selectedTrip?.type}</span></p>
          <hr />
          <p>{selectedTrip?.description}</p>
          {selectedTrip?.comments && (
            <Alert variant="info">
              <strong>Good to know:</strong> {selectedTrip.comments}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default SuggestedTripsPage;