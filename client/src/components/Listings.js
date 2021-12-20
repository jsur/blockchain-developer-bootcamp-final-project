import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import Text from './Text';
import Spinner from './Spinner';
import useListings from '../hooks/useListings';
import { shortenAddress } from '../utils/shortenAddress';
import { colors } from '../theme';

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
  max-width: 90%;
  flex-wrap: wrap;
`;

const StyledItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 5px;
  max-width: 175px;
`;

const StyledItemTextContainer = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
`;

const FilteredListing = ({ listings, status }) => {
  const filtered = listings.filter((l) => l.status === status);

  if (filtered.length < 1) {
    return <Text>Nothing here 🤷</Text>;
  }

  return (
    <StyledDiv>
      {filtered.map((l) => {
        const id = BigNumber.from(l.propertyId).toNumber();
        return <ListingItem key={id} item={l} />;
      })}
    </StyledDiv>
  );
};

const ListingItem = ({ item }) => {
  const { propertyId, description, location, currentRentAmount: amount, imgUrl } = item;
  return (
    <StyledItem>
      <img src={imgUrl} alt="listing" style={{ height: '150px', width: '100%', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text center>{description}</Text>
        <Text center bold color={colors.green}>
          {formatEther(amount)} ETH/mo
        </Text>
        <Text center>{location}</Text>
        {item.status === 0 && (
          <Link
            style={{ textAlign: 'center' }}
            to={{ pathname: '/details', search: `?id=${BigNumber.from(propertyId).toNumber()}` }}
          >
            More info
          </Link>
        )}
        {item.status === 1 && item.tenant && <Text center>Tenant: {shortenAddress(item.tenant)}</Text>}
      </StyledItemTextContainer>
    </StyledItem>
  );
};

const Listings = ({ rentalsAddress }) => {
  const { active } = useWeb3React();
  const { listings, loading } = useListings(rentalsAddress);

  if (!active) {
    return null;
  }

  if (loading) {
    return <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />;
  }

  return (
    <>
      <Text t3 color={colors.green}>
        Available listings
      </Text>
      <FilteredListing listings={listings} status={0} />
    </>
  );
};

export default Listings;
