import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Box textAlign="center" py={12} display="grid" gap={3} justifyItems="center">
      <Typography variant="h1" fontWeight={700} color="primary.main">
        404
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        We could not find that page.
      </Typography>
      <Typography variant="body1" color="text.secondary" maxWidth={420}>
        The page you are looking for might have been removed or is temporarily unavailable.
      </Typography>
      <Button variant="contained" size="large" component={RouterLink} to="/appointments">
        Back to appointments
      </Button>
    </Box>
  );
}
