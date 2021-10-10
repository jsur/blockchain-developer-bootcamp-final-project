import React from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import Text from './Text';
import Card from './Card';
import { injected } from '../connectors';
import { shortenAddress } from '../utils/shortenAddress';
import { useAppContext } from '../AppContext';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-light' })``;

const MetamaskConnectButton = () => {
  const { setContentError } = useAppContext();
  const { activate, active, account, deactivate } = useWeb3React();

  if (active) {
    return (
      <Card className="d-flex flex-row justify-content-between align-items-center" style={{ maxWidth: 300 }}>
        <Text uppercase color="white">
          {shortenAddress(account)}
        </Text>
        <ConnectBtn onClick={deactivate}>Log Out</ConnectBtn>
      </Card>
    );
  }

  return (
    <ConnectBtn
      onClick={() => {
        activate(injected, (e) => {
          if (e instanceof UnsupportedChainIdError) {
            setContentError('Only Ropsten supported currently!');
          }
        });
      }}
    >
      Connect
    </ConnectBtn>
  );
};

export default MetamaskConnectButton;
