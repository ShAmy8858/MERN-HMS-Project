import React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CircularProgress from '@mui/material/CircularProgress';

import { appointmentService } from '../services/appointmentService.js';
import { AppointmentStatusChip } from '../components/AppointmentStatusChip.jsx';
import { DashboardStatCard } from '../components/DashboardStatCard.jsx';
import { EmptyState } from '../components/EmptyState.jsx';
import { useAuth } from '../modules/auth/AuthContext.jsx';

const STATUS_OPTIONS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'];

export default function AppointmentsPage() {
  const { token } = useAuth();
  const [appointments, setAppointments] = React.useState([]);
  const [filteredAppointments, setFilteredAppointments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [departmentFilter, setDepartmentFilter] = React.useState('all');

  const refreshAppointments = React.useCallback(async () => {
    if (!token) {
      setAppointments([]);
      setError('Authentication required');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await appointmentService.list(token);
      setAppointments(data);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  React.useEffect(() => {
    if (token) {
      refreshAppointments();
    }
  }, [refreshAppointments, token]);

  React.useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      const matchesSearch = [
        appointment.patientName,
        appointment.patientId,
        appointment.doctor,
        appointment.department,
        appointment.reason
      ]
        .join(' ')
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
      const matchesDept =
        departmentFilter === 'all' || appointment.department.toLowerCase() === departmentFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesDept;
    });

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, departmentFilter]);

  const departmentOptions = React.useMemo(() => {
    const departments = new Set(appointments.map((appointment) => appointment.department));
    return ['all', ...Array.from(departments)];
  }, [appointments]);

  const stats = React.useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter((appointment) => appointment.status === 'confirmed').length;
    const pending = appointments.filter((appointment) => appointment.status === 'pending').length;
    const completed = appointments.filter((appointment) => appointment.status === 'completed').length;
    return {
      total,
      confirmed,
      pending,
      completed
    };
  }, [appointments]);

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Todays appointments
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor patient flow, manage schedules, and keep your teams aligned in real time.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <DashboardStatCard
            icon={<EventAvailableIcon />}
            title="Total scheduled"
            value={stats.total}
            trendLabel="Completed"
            trendValue={`${stats.completed}`}
            trendColor="success.main"
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <DashboardStatCard
            icon={<FactCheckIcon />}
            title="Confirmed"
            value={stats.confirmed}
            trendLabel="Pending"
            trendValue={`${stats.pending}`}
            trendColor="warning.main"
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <DashboardStatCard
            icon={<PendingActionsIcon />}
            title="Pending review"
            value={stats.pending}
            trendLabel="Awaiting confirmation"
            trendValue={`${Math.max(stats.pending - stats.confirmed, 0)}`}
            trendColor="warning.main"
          />
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <DashboardStatCard
            icon={<FactCheckIcon />}
            title="Completed"
            value={stats.completed}
            trendLabel="On track"
            trendValue={`${Math.round((stats.completed / Math.max(stats.total, 1)) * 100)}%`}
          />
        </Grid>
      </Grid>

      <Card>
        <CardHeader
          title={<Typography variant="h5">Upcoming schedule</Typography>}
          subheader="Keep an eye on pending approvals and time-sensitive visits."
          action={
            <Tooltip title="Refresh appointments">
              <IconButton onClick={refreshAppointments} disabled={isLoading}>
                {isLoading ? <CircularProgress size={22} /> : <RefreshIcon />}
              </IconButton>
            </Tooltip>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2} mb={3}>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search by patient, doctor, or reason"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <TextField
                select
                fullWidth
                label="Status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option === 'all' ? 'All statuses' : option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={6} md={4}>
              <TextField
                select
                fullWidth
                label="Department"
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
              >
                {departmentOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option === 'all' ? 'All departments' : option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          {error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : null}

          {filteredAppointments.length === 0 && !isLoading ? (
            <EmptyState
              title="No appointments match your filters"
              description="Try adjusting the filters or refreshing the schedule to see the latest data."
              actionLabel="Reset filters"
              onAction={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDepartmentFilter('all');
                refreshAppointments();
              }}
            />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Patient</TableCell>
                    <TableCell>Department</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Scheduled</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAppointments.map((appointment) => (
                    <TableRow key={appointment.id} hover sx={{ '&:last-of-type td': { border: 0 } }}>
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {appointment.patientName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {appointment.patientId}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={appointment.department} size="small" color="secondary" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>{appointment.doctor}</TableCell>
                      <TableCell>
                        {new Date(appointment.scheduledAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })}
                      </TableCell>
                      <TableCell>
                        <AppointmentStatusChip status={appointment.status} isOverdue={appointment.isOverdue} />
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" color="text.secondary">
                          {appointment.notes}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
