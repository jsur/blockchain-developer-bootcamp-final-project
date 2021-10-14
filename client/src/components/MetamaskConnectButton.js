import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Button from 'react-bootstrap/Button';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import Text from './Text';
import Card from './Card';
import { injected } from '../connectors';
import { shortenAddress } from '../utils/shortenAddress';
import { useAppContext } from '../AppContext';

const ConnectBtn = styled(Button).attrs({ variant: 'outline-light' })``;

const pageState = {
  LOADING: 'LOADING',
  READY: 'READY',
};

const MetamaskConnectButton = () => {
  const { setContentError } = useAppContext();
  const { activate, active, account, deactivate } = useWeb3React();
  const [status, setStatus] = useState(pageState.LOADING);

  useEffect(() => {
    const tryActivate = async () => {
      await activate(injected, () => {
        setStatus(pageState.READY);
      });
      setStatus(pageState.READY);
    };
    tryActivate();
  }, []);

  if (status === pageState.LOADING) {
    return <Text>Loading..</Text>;
  }

  if (status === pageState.READY && !active) {
    return (
      <ConnectBtn
        onClick={() => {
          activate(injected, (e) => {
            if (e instanceof UnsupportedChainIdError) {
              setContentError('Only Ropsten supported.');
            }
          });
        }}
      >
        Connect
      </ConnectBtn>
    );
  }

  return (
    <Card className="d-flex flex-row justify-content-between align-items-center" style={{ maxWidth: 300 }}>
      <Text uppercase color="white">
        {shortenAddress(account)}
      </Text>
      <ConnectBtn onClick={deactivate}>Log Out</ConnectBtn>
    </Card>
  );
};

export default MetamaskConnectButton;
