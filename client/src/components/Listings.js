import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { colors } from '../theme';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2em;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
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

const ListingItem = ({ item }) => {
  const { propertyId, description, location, currentRentAmount: amount, infoUrl } = item;
  return (
    <StyledItem>
      {/* TODO: use imgUrl and not infoUrl */}
      <img src={infoUrl} alt="listing" style={{ height: '150px', width: '150px', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text>{description}</Text>
        <Text>{location}</Text>
        <Text>{BigNumber.from(amount).toNumber()} ETH / month</Text>
        <Link to={{ pathname: '/details', search: `?id=${BigNumber.from(propertyId).toNumber()}` }}>More info</Link>
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
      // TODO: figure out a better data structure for this
      const arr = await Promise.all([contract.properties(1), contract.properties(2)]);
      setListings(arr);
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
      {listings.map((l) => {
        const id = BigNumber.from(l.propertyId).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

export default Listings;
