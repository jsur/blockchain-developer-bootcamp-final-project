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

import RentalsABI from '../../contract-build/contracts/Rentals.json';

const listingState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

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

const StyledRentedDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 65%;
  padding: 10px;
`;

const RentedListings = ({ listings }) => {
  const filtered = listings
    .filter((l) => l.status === 1)
    .map((l) => {
      return {
        ...l,
        latestTenantPayment: {
          ...l.latestTenantPayment,
          timestampDate: new Date(l.latestTenantPayment.timestamp.toNumber() * 1000),
        },
      };
    })
    .sort((a, b) => b.latestTenantPayment.timestampDate - a.latestTenantPayment.timestampDate);
  return (
    <StyledRentedDiv>
      <table>
        <thead>
          <tr>
            {['Listing', 'Tenant', 'Last payment'].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => {
            return (
              <tr key={l.propertyId.toNumber()}>
                {[l.description, shortenAddress(l.tenant), l.latestTenantPayment.timestampDate.toISOString()].map(
                  (item) => {
                    return (
                      <td>
                        <Text>{item}</Text>
                      </td>
                    );
                  },
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </StyledRentedDiv>
  );
};

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
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState(listingState.LOADING);
  const { active } = useWeb3React();
  const contract = useContract(rentalsAddress, RentalsABI.abi);

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
    return null;
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
      <RentedListings listings={listings} />
    </>
  );
};

export default Listings;
