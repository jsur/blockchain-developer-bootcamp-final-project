import React from 'react';
import styled from 'styled-components';
import { Button, Container } from 'react-bootstrap';
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
  const contract = useContract(CONTRACT_ADDRESS_RENTALS, RentalsABI.abi);

  console.log('contract is:', contract);

  const searchParams = new URLSearchParams(location.search);
  const propertyId = searchParams.get('id');

  const onBuyClick = async () => {
    // TODO: setstate loading etc
    await contract.addAsTenant(propertyId);
  };

  return (
    <Container className="mt-5 d-flex flex-column justify-content-center align-items-center">
      <Text t1>Details</Text>
      <Text>Listing details here from S3 (off-chain) or something TODO</Text>
      <BuyButton onClick={onBuyClick}>I want this</BuyButton>
    </Container>
  );
};

export default Details;
