import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Container, Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { Link, Redirect } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import Text from '../../components/Text';
import { CONTRACT_ADDRESS_RENTALS } from '../../constants';
import RentalsABI from '../../../../build/contracts/Rentals.json';

import { colors } from '../../theme';

const DetailsState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
  SOLD: 'SOLD',
};

const CONFIRMATIONS_WAIT = 1; // TODO: does wait() work? https://github.com/ethers-io/ethers.js/issues/945
const KEYCODE_DUMMY = 455224;

const BuyButton = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const Details = ({ location }) => {
  const [status, setStatus] = useState(DetailsState.READY);
  const [txHash, setTxHash] = useState(null);
  const [listing, setListing] = useState(undefined);
  const { active, account } = useWeb3React();
  const contract = useContract(CONTRACT_ADDRESS_RENTALS, RentalsABI.abi);

  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('id');

  useEffect(() => {
    const getListing = async () => {
      const listing = await contract.properties(Number(propertyId));
      console.log('listing is:', listing);
      setListing(listing);
    };
    getListing();
  }, []);

  const onBuyClick = async () => {
    setStatus(DetailsState.LOADING);
    try {
      const transaction = await contract.addAsTenant(propertyId, {
        from: account,
        value: listing.currentRentAmount,
      });
      console.log('transaction:', transaction);
      await transaction.wait(CONFIRMATIONS_WAIT);
      setTxHash(transaction.hash);
      setStatus(DetailsState.SOLD);
    } catch (e) {
      setStatus(DetailsState.ERROR);
    }
  };

  if (!active) return <Redirect to="/" />;

  const { LOADING, READY, SOLD } = DetailsState;

  return (
    <Container fluid className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text t1>Details</Text>
      <Text>Off-chain listing details here (AWS S3 etc.) or something TODO</Text>
      {status === LOADING && (
        <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />
      )}
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
    </Container>
  );
};

export default Details;
