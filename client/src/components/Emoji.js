import React from 'react';

export const emojis = {
  rotatingLight: {
    label: 'rotating_light',
    symbol: '🚨',
  },
  warning: {
    label: 'warning',
    symbol: '⚠️',
  },
  checkmark: {
    label: 'white_check_mark',
    symbol: '✅',
  },
  skull: {
    label: 'skull',
    symbol: '💀',
  },
};

const Emoji = ({ name }) => {
  const { label, symbol } = emojis[name];
  return (
    <span className="emoji" role="img" aria-label={label || ''} aria-hidden={label ? 'false' : 'true'}>
      {symbol}
    </span>
  );
};

export default Emoji;
