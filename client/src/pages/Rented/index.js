import React from 'react';
import { differenceInMinutes } from 'date-fns';
import styled from 'styled-components';
import Emoji, { emojis } from '../../components/Emoji';
import Text from '../../components/Text';
import Spinner from '../../components/Spinner';
import useRentals from '../../hooks/useRentals';
import useListings from '../../hooks/useListings';
import { shortenAddress } from '../../utils/shortenAddress';

const StyledRentedDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  padding: 10px 0;
`;

const getPaymentStatus = (timestamp) => {
  const LIMIT_MINS = 30;
  const diff = differenceInMinutes(new Date(), timestamp);
  if (diff > LIMIT_MINS * 0.9) return <Emoji emoji={emojis.skull} />;
  if (diff > LIMIT_MINS * 0.7) return <Emoji emoji={emojis.rotatingLight} />;
  if (diff > LIMIT_MINS * 0.4) return <Emoji emoji={emojis.warning} />;
  return <Emoji emoji={emojis.checkmark} />;
};

const RentedListings = ({ rentalsAddress }) => {
  const { loading, listings } = useListings(rentalsAddress);
  if (loading) {
    return <Spinner />;
  }
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
          <tr align="center">
            {['Listing', 'Tenant', 'Last payment', 'Payment status'].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => {
            return (
              <tr key={l.propertyId.toNumber()}>
                <td align="center">
                  <Text>{l.description}</Text>
                </td>
                <td align="center">
                  <Text>{shortenAddress(l.tenant)}</Text>
                </td>
                <td align="center">
                  <Text>{l.latestTenantPayment.timestampDate.toLocaleString()}</Text>
                </td>
                <td align="center">{getPaymentStatus(l.latestTenantPayment.timestampDate)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </StyledRentedDiv>
  );
};

const Rented = () => {
  const { rentalsAddress } = useRentals();
  return (
    <>
      <Text center t1>
        Rented apartments
      </Text>
      <br />
      <Text color="green" center t5>
        A Gelato resolver contract will check payment statuses periodically.
      </Text>
      <Text color="green" center t5>
        If payments are late, the tenant will be removed and the listing be available again.
      </Text>
      <br />
      {rentalsAddress && <RentedListings rentalsAddress={rentalsAddress} />}
    </>
  );
};

export default Rented;
