import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, Container } from 'react-bootstrap';
import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import { useWeb3React } from '@web3-react/core';
import { Redirect } from 'react-router-dom';
import { useContract } from '../../hooks/useContract';
import Text from '../../components/Text';
import { CONTRACT_ADDRESS_RENTALS } from '../../constants';
import RentalsABI from '../../../../build/contracts/Rentals.json';

import { colors } from '../../theme';

const DetailsState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const BuyButton = styled(Button).attrs({ variant: 'outline-success' })`
  color: ${colors.green};
  border-color: ${colors.green};
  margin-top: 20px;
`;

const Details = ({ location }) => {
  const [status, setStatus] = useState(DetailsState.READY);
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
      await contract.addAsTenant(propertyId, {
        from: account,
        value: listing.currentRentAmount,
      });
      // TODO: Show success
      // TODO: Show listing state in Home
      setStatus(DetailsState.READY);
    } catch (e) {
      setStatus(DetailsState.ERROR);
    }
  };

  if (!active) return <Redirect to="/" />;

  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text t1>Details</Text>
      <Text>Off-chain listing details here (AWS S3 etc.) or something TODO</Text>
      <BuyButton disabled={!listing || status === DetailsState.LOADING} onClick={onBuyClick}>
        I want this
      </BuyButton>
    </Container>
  );
};

export default Details;
