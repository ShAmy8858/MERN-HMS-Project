import React from 'react';
import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';

const STATUS_CONFIG = {
  pending: { color: 'warning', label: 'Pending' },
  confirmed: { color: 'success', label: 'Confirmed' },
  completed: { color: 'primary', label: 'Completed' },
  cancelled: { color: 'error', label: 'Cancelled' }
};

export function AppointmentStatusChip({ status, isOverdue }) {
  const config = STATUS_CONFIG[status] ?? { color: 'default', label: status };
  const label = isOverdue && status !== 'completed' ? `${config.label} · Overdue` : config.label;

  return <Chip label={label} color={config.color} variant={config.color === 'default' ? 'outlined' : 'filled'} sx={{ fontWeight: 600 }} />;
}

AppointmentStatusChip.propTypes = {
  status: PropTypes.string.isRequired,
  isOverdue: PropTypes.bool
};

AppointmentStatusChip.defaultProps = {
  isOverdue: false
};
