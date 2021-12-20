import { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import useContract from './useContract';

import RentalsABI from '../../contract-build/contracts/Rentals.json';

const listingState = {
  LOADING: 'LOADING',
  READY: 'READY',
  ERROR: 'ERROR',
};

const useListings = (rentalsAddress) => {
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

  return {
    listings,
    loading: status === listingState.LOADING,
  };
};

export default useListings;
