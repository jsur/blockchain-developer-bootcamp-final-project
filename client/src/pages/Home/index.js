import React from 'react';
import { Container } from 'react-bootstrap';
import Text from '../../components/Text';
import Listings from '../../components/Listings';

const Home = () => {
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text center t1 style={{ marginBottom: '20px' }}>
        Rent an apartment with just ETH.
      </Text>
      <Listings />
    </Container>
  );
};

export default Home;
