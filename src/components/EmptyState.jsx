import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

export function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <Box
      textAlign="center"
      px={6}
      py={8}
      borderRadius={4}
      bgcolor="background.paper"
      border="1px dashed"
      borderColor="divider"
    >
      <Typography variant="h5" fontWeight={600} gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={480} mx="auto">
        {description}
      </Typography>
      {actionLabel ? (
        <Button sx={{ mt: 4 }} variant="contained" color="primary" size="large" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </Box>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func
};

EmptyState.defaultProps = {
  actionLabel: null,
  onAction: undefined
};
