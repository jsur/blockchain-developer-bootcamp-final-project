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

const Emoji = ({ emoji }) => {
  return (
    <span className="emoji" role="img" aria-label={emoji.label || ''} aria-hidden={emoji.label ? 'false' : 'true'}>
      {emoji.symbol}
    </span>
  );
};

export default Emoji;
