import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Text from './Text';
import { StyledHeaderBox } from './StyledHelpers';
import { colors } from '../theme';
import useEth from '../hooks/useEth';

const BalanceCard = () => {
  const { active, account } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();

  useEffect(() => {
    if (account) {
      fetchEthBalance();
    }
  }, [account]);

  if (!active) {
    return <Text>{''}</Text>;
  }

  return (
    <StyledHeaderBox>
      <Text block color={colors.green}>
        ETH balance: {ethBalance}
      </Text>
    </StyledHeaderBox>
  );
};

export default BalanceCard;
