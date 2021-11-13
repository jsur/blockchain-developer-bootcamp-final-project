import React from 'react';
import { Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import Text from '../../components/Text';
import Listings from '../../components/Listings';
import { useRentals } from '../../hooks/useRentals';
import { colors } from '../../theme';

const Home = () => {
  const { active } = useWeb3React();
  const { rentalsAddress } = useRentals();

  const NotActive = () => {
    return (
      <Text>
        Connect{' '}
        {
          <Text>
            <a style={{ color: colors.green }} href="https://faucet.ropsten.be/" target="blank">
              Ropsten
            </a>
          </Text>
        }{' '}
        wallet to continue.
      </Text>
    );
  };

  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text center t1 style={{ marginBottom: '20px' }}>
        Rent an apartment with just ETH.
      </Text>
      {!active && <NotActive />}
      {rentalsAddress && <Listings rentalsAddress={rentalsAddress} />}
    </Container>
  );
};

export default Home;
