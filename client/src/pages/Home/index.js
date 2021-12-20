import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { Link } from 'react-router-dom';
import Text from '../../components/Text';
import Listings from '../../components/Listings';
import useRentals from '../../hooks/useRentals';
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
    <>
      <Text center t1 style={{ marginBottom: '20px' }}>
        Rent an apartment with just ETH.
      </Text>
      {!active && <NotActive />}
      {rentalsAddress && <Listings rentalsAddress={rentalsAddress} />}
      <div style={{ position: 'absolute', bottom: '5%' }}>
        <Link to="/rented" style={{ color: colors.red }}>
          See rented apartments
        </Link>
      </div>
    </>
  );
};

export default Home;
