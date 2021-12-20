import React from 'react';
import { Spinner } from 'react-bootstrap';

import { colors } from '../theme';

const DefaultSpinner = () => {
  return <Spinner animation="border" size="sm" style={{ color: colors.green, marginTop: '20px' }} />;
};

export default DefaultSpinner;
