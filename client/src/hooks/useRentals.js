import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import RentalsABI from '../../contract-build/contracts/Rentals.json';

const useRentals = () => {
  const { chainId } = useWeb3React();
  const [rentalsAddress, setRentalsAddress] = useState(null);

  useEffect(() => {
    if (chainId) {
      setRentalsAddress(RentalsABI.networks[chainId]?.address);
    }
  }, [chainId]);

  return {
    rentalsAddress,
  };
};

export default useRentals;
