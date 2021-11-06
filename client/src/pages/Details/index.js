import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Link, Redirect } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import Text from '../../components/Text';
import { CONTRACT_ADDRESS_RENTALS } from '../../constants';
import RentalsABI from '../../../contract-build/contracts/Rentals.json';

import { colors } from '../../theme';

const DetailsState = {
  LOADING: 'LOADING',
  WAITING: 'WAITING_CONFIRMATIONS',
  READY: 'READY',
  ERROR: 'ERROR',
  SOLD: 'SOLD',
};

const KEYCODE_DUMMY = 455224;
const CONFIRMATION_COUNT = 2;

const BuyButton = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const Details = ({ location }) => {
  const [status, setStatus] = useState(DetailsState.READY);
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [listing, setListing] = useState(undefined);
  const { active, account, chainId } = useWeb3React();
  const contract = useContract(CONTRACT_ADDRESS_RENTALS, RentalsABI.abi);
  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('id');

  useEffect(() => {
    const getListing = async () => {
      const listing = await contract.properties(Number(propertyId));
      setListing(listing);
    };
    getListing();
  }, []);

  const onBuyClick = async () => {
    setStatus(DetailsState.LOADING);
    try {
      setStatus(DetailsState.WAITING);
      const transaction = await contract.addAsTenant(propertyId, {
        from: account,
        value: listing.currentRentAmount,
      });
      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await transaction.wait(confirmations);
      setTxHash(transaction.hash);
      setStatus(DetailsState.SOLD);
    } catch (e) {
      setStatus(DetailsState.ERROR);
      if (e.code && typeof e.code === 'number') {
        setMmError(e.message);
      }
    }
  };

  if (!active) return <Redirect to="/" />;

  const { LOADING, WAITING, READY, SOLD, ERROR } = DetailsState;

  return (
    <Container fluid className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text t1>Details</Text>
      <Text style={{ maxWidth: '50%', margin: '10px', textAlign: 'center' }}>
        Off chain listing details: Nullam quis arcu vitae sapien pulvinar viverra sed eget libero. Mauris vel sapien
        rhoncus, sodales massa sit amet, congue mi. Praesent feugiat gravida erat, sit amet auctor tortor mattis non.
      </Text>
      {status === LOADING ||
        (status === WAITING && (
          <>
            <Spinner
              animation="border"
              size="sm"
              style={{ color: colors.green, marginTop: '20px', marginBottom: '20px' }}
            />
            {status === WAITING && <Text>The apartment is yours after {CONFIRMATION_COUNT} block confirmations.</Text>}
          </>
        ))}
      {status === READY && (
        <BuyButton disabled={!listing} onClick={onBuyClick}>
          I want this
        </BuyButton>
      )}
      {status === SOLD && !!txHash && (
        <>
          <Text t3 color={colors.green} style={{ marginTop: '20px', marginBottom: '20px' }}>
            This apartment is now yours! Access it with this keycode: {KEYCODE_DUMMY}
          </Text>
          <Text>
            See this transaction in{' '}
            <Link to={{ pathname: `https://ropsten.etherscan.io/tx/${txHash}` }} target="_blank">
              Etherscan
            </Link>
          </Text>
          <Link to="/">Back to front page</Link>
        </>
      )}
      {status === ERROR && (
        <>
          <Text style={{ marginTop: '20px', marginBottom: '20px' }} color={colors.red}>
            {mmError || 'Error encountered!'}
          </Text>
          <Link to="/">Back to front page</Link>
        </>
      )}
    </Container>
  );
};

export default Details;
