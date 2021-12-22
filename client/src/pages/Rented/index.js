import React from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { addSeconds } from 'date-fns';
import Emoji from '../../components/Emoji';
import Text from '../../components/Text';
import Spinner from '../../components/Spinner';
import useRentals from '../../hooks/useRentals';
import useListings from '../../hooks/useListings';
import { shortenAddress } from '../../utils/shortenAddress';
import GelatoSvg from '../../static/powered_by_gelato_white.svg';

const StyledRentedDiv = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 20px;
  padding: 10px 0;
`;

const paymentState = {
  OK: 0,
  WARNING: 1,
  ALERT: 2,
  HIGHALERT: 3,
  TERMINATED: 4,
};

const getPaymentStatus = (paymentStatus) => {
  switch (paymentStatus) {
    case paymentState.OK:
      return <Emoji name="checkmark" />;
    case paymentState.WARNING:
      return <Emoji name="warning" />;
    case paymentState.ALERT:
      return <Emoji name="rotatingLight" />;
    case paymentState.HIGHALERT:
      return <Emoji name="skull" />;
    default:
      return null;
  }
};

const RentedListings = ({ rentalsAddress }) => {
  const { active } = useWeb3React();
  const { loading, listings } = useListings(rentalsAddress);

  if (!active) return <Redirect to="/" />;

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

  if (filtered.length === 0) {
    return (
      <StyledRentedDiv style={{ alignItems: 'center' }}>
        <Text>Nothing here 🤷</Text>
      </StyledRentedDiv>
    );
  }

  return (
    <StyledRentedDiv>
      <table>
        <thead>
          <tr align="center">
            {['Listing', 'Tenant', 'Last payment', 'Next payment due', 'Payment status'].map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filtered.map((l) => {
            const { timestampDate, paymentStatus } = l.latestTenantPayment;
            return (
              <tr key={l.propertyId.toNumber()}>
                <td align="center">
                  <Text>{l.description}</Text>
                </td>
                <td align="center">
                  <Text>{shortenAddress(l.tenant)}</Text>
                </td>
                <td align="center">
                  <Text>{timestampDate.toLocaleString()}</Text>
                </td>
                <td align="center">{addSeconds(timestampDate, l.paymentPeriodSec).toLocaleString()}</td>
                <td align="center">{getPaymentStatus(paymentStatus)}</td>
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
        A Gelato scheduled task will check payment statuses periodically.
      </Text>
      <Text color="green" center t5>
        If payments are late, the tenant will be removed and the listing is available again.
      </Text>
      <br />
      {rentalsAddress && <RentedListings rentalsAddress={rentalsAddress} />}
      <a
        href="https://www.gelato.network/"
        target="_blank"
        rel="noreferrer"
        style={{ position: 'absolute', bottom: '2%' }}
      >
        <img src={GelatoSvg} alt="Powered by Gelato" style={{ width: '200px' }} />
      </a>
    </>
  );
};

export default Rented;
