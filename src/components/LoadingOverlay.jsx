import React from 'react';
import PropTypes from 'prop-types';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export function LoadingOverlay({ message }) {
  return (
    <Backdrop open sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.modal + 1 }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="inherit" thickness={4} size={60} />
        <Typography variant="subtitle1" fontWeight={600}>
          {message}
        </Typography>
      </Stack>
    </Backdrop>
  );
}

LoadingOverlay.propTypes = {
  message: PropTypes.string
};

LoadingOverlay.defaultProps = {
  message: 'Please wait...'
};
