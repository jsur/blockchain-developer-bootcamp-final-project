import React, { useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import Text from './Text';
import Card from './Card';
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
    <Card className="d-flex flex-row align-items-center" style={{ maxWidth: 250, height: 80 }}>
      <Text block color={colors.green}>
        ETH balance: {ethBalance}
      </Text>
    </Card>
  );
};

export default BalanceCard;
