import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core';
import Text from './Text';
import { StyledHeaderBox } from './StyledHelpers';
import { injected } from '../connectors';
import { shortenAddress } from '../utils/shortenAddress';
import { useAppContext } from '../AppContext';

const ConnectBtn = styled.button`
  border: 1px solid white;
  background: transparent;
  color: white;
  border-radius: 5px;
  margin-left: 10px;
`;

const pageState = {
  LOADING: 'LOADING',
  READY: 'READY',
};

const onLogOut = (deactivate, cb) => {
  deactivate();
  cb();
};

const MetamaskConnectButton = () => {
  const history = useHistory();
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
          if (!window.ethereum) {
            setContentError("Looks like you don't have Metamask, you'll need it to use this app.");
            return;
          }
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
    <StyledHeaderBox>
      <Text uppercase color="green">
        {shortenAddress(account)}
      </Text>
      <ConnectBtn onClick={() => onLogOut(deactivate, () => history.push('/'))}>Log Out</ConnectBtn>
    </StyledHeaderBox>
  );
};

export default MetamaskConnectButton;
