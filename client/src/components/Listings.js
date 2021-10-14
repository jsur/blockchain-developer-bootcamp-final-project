import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { colors } from '../theme';
import { CONTRACT_ADDRESS_RENTALS } from '../constants';
import RentalsABI from '../../../build/contracts/Rentals.json';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledItemTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

const ListingItem = ({ description, location, amount, imgUrl }) => {
  return (
    <StyledItem>
      <img src={imgUrl} alt="listing" style={{ height: '150px', width: '150px', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text>{description}</Text>
        <Text>{location}</Text>
        <Text>{amount} ETH / month</Text>
        <a href="http://google.com" target="_blank" rel="noreferrer">
          More info
        </a>
      </StyledItemTextContainer>
    </StyledItem>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const { active } = useWeb3React();
  const contract = useContract(CONTRACT_ADDRESS_RENTALS, RentalsABI.abi);

  const getProperties = useCallback(async (contract) => {
    try {
      const listing = await contract.properties(1);
      console.log('listing:', listing);
      setListings([listing]);
    } catch (e) {
      console.log('error:', e);
    }
  }, []);

  useEffect(() => {
    if (active) {
      getProperties(contract);
    }
  }, [active]);

  if (!active) {
    return <NotActive />;
  }

  return (
    <StyledDiv>
      {listings.map((l) => (
        <ListingItem
          key={BigNumber.from(l.propertyId).toNumber()}
          description={l.description}
          location={l.location}
          amount={BigNumber.from(l.currentRentAmount).toNumber()}
          imgUrl={l.infoUrl}
        />
      ))}
    </StyledDiv>
  );
};

export default Listings;
