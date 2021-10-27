import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Spinner } from 'react-bootstrap';
import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import { formatEther } from '@ethersproject/units';
import Text from './Text';
import { useContract } from '../hooks/useContract';
import { shortenAddress } from '../utils/shortenAddress';
import { colors } from '../theme';

import { CONTRACT_ADDRESS_RENTALS } from '../constants';
import RentalsABI from '../../contract-build/contracts/Rentals.json';

const listingState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const StyledDiv = styled.div`
  display: flex;
  justify-content: center;
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
  const { propertyId, description, location, currentRentAmount: amount, imgUrl } = item;
  return (
    <StyledItem>
      {/* TODO: use imgUrl and not infoUrl */}
      <img src={imgUrl} alt="listing" style={{ height: '150px', width: '150px', borderRadius: '5px' }} />
      <StyledItemTextContainer>
        <Text>{description}</Text>
        <Text>{location}</Text>
        <Text>{formatEther(amount)} ETH / month</Text>
        {item.status === 0 && (
          <Link to={{ pathname: '/details', search: `?id=${BigNumber.from(propertyId).toNumber()}` }}>More info</Link>
        )}
        {item.status === 1 && item.tenant && <Text>Tenant: {shortenAddress(item.tenant)}</Text>}
      </StyledItemTextContainer>
    </StyledItem>
  );
};

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active } = useWeb3React();
  const contract = useContract(CONTRACT_ADDRESS_RENTALS, RentalsABI.abi);

  const getProperties = useCallback(async (contract) => {
    try {
      // still on the lookout for optimal solidity data structures, this ain't it
      const idListLengthBN = await contract.idListLength();
      const idBNs = await Promise.all(Array.from(Array(idListLengthBN.toNumber())).map((_, i) => contract.idList(i)));
      const ids = idBNs.map((n) => n.toNumber());
      const arr = await Promise.all(ids.map((id) => contract.properties(id)));
      setListings(arr);
      setStatus(listingState.READY);
    } catch (e) {
      console.log('error:', e);
      setStatus(listingState.ERROR);
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

  if (status === listingState.LOADING) {
    return <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />;
  }

  return (
    <>
      <Text t3 color={colors.green}>
        Available listings
      </Text>
      <FilteredListing listings={listings} status={0} />
      <Text t3 color={colors.red} style={{ marginTop: '20px' }}>
        Rented
      </Text>
      <FilteredListing listings={listings} status={1} />
    </>
  );
};

export default Listings;
