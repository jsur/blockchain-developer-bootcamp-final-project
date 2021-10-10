import React from 'react';
import { Container } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import ConnectWalletModal from '../../components/ConnectWalletModal';
import Text from '../../components/Text';
import useWalletConnectionModal from '../../hooks/useWalletConnectionModal';
import { colors } from '../../theme';

const Listings = () => {
  const { active } = useWeb3React();

  if (!active) {
    return <Text>Connect {<Text color={colors.green}>Ropsten</Text>} wallet to continue.</Text>;
  }

  return <Text>here be listings</Text>;
};

const Home = () => {
  const { isWalletConnectModalOpen } = useWalletConnectionModal();
  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      {isWalletConnectModalOpen && <ConnectWalletModal />}
      <Text t1>Rent an apartment with just ETH.</Text>
      <Listings />
    </Container>
  );
};

export default Home;
