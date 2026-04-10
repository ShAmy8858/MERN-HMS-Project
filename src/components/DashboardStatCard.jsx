import React from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';

export function DashboardStatCard({ icon, title, value, trendLabel, trendValue, trendColor }) {
  return (
    <Card sx={{ height: '100%', border: '1px solid', borderColor: 'divider' }}>
      <CardContent>
        <Stack spacing={2} direction="row" alignItems="center">
          <Avatar sx={{ background: 'linear-gradient(135deg, rgba(22,90,157,0.1) 0%, rgba(0,166,166,0.15) 100%)', color: 'primary.main' }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" color="text.secondary" textTransform="uppercase" fontWeight={600} letterSpacing={1}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} color="text.primary">
              {value}
            </Typography>
            {trendLabel && trendValue ? (
              <Typography variant="body2" color={trendColor ?? 'text.secondary'}>
                {trendLabel} · {trendValue}
              </Typography>
            ) : null}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

DashboardStatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trendLabel: PropTypes.string,
  trendValue: PropTypes.string,
  trendColor: PropTypes.string
};

DashboardStatCard.defaultProps = {
  trendLabel: null,
  trendValue: null,
  trendColor: 'text.secondary'
};
