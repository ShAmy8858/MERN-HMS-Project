import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

import { useAuth } from '../modules/auth/AuthContext.jsx';

const NAV_LINKS = [
  { label: 'Appointments', path: '/appointments', roles: ['admin', 'manager', 'staff'] },
  { label: 'Admin', path: '/admin', roles: ['admin', 'manager'] }
];

export default function AppLayout({ children }) {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ backgroundColor: 'background.default' }}>
      <AppBar position="sticky" color="transparent" elevation={0} sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between', gap: 3 }}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ width: 44, height: 44, borderRadius: 2, background: 'linear-gradient(135deg, #165a9d 0%, #00a6a6 100%)', display: 'grid', placeItems: 'center' }}>
                <Typography variant="h6" component="div" color="common.white" fontWeight={700}>
                  PC
                </Typography>
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700} color="primary.main">
                  PulseCare
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Hospital Appointment Management
                </Typography>
              </Box>
            </Stack>

            {isAuthenticated ? (
              <Stack direction="row" spacing={3} alignItems="center">
                {NAV_LINKS.filter((link) => link.roles.includes(user.role)).map((link) => {
                  const isActive = location.pathname.startsWith(link.path);
                  return (
                    <Link
                      key={link.path}
                      component={RouterLink}
                      to={link.path}
                      underline="none"
                      color={isActive ? 'primary.main' : 'text.secondary'}
                      fontWeight={isActive ? 700 : 500}
                      sx={{
                        position: 'relative',
                        fontSize: '0.95rem',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          bottom: -6,
                          width: '100%',
                          height: isActive ? 3 : 0,
                          borderRadius: 999,
                          background: 'linear-gradient(90deg, #165a9d, #00a6a6)',
                          transition: 'height 0.2s ease'
                        }
                      }}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Divider orientation="vertical" flexItem sx={{ borderColor: 'divider' }} />
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box textAlign="right">
                    <Typography variant="subtitle2" fontWeight={600}>
                      {user.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {user.department}
                    </Typography>
                  </Box>
                  <Tooltip title="Account options">
                    <IconButton onClick={handleMenuOpen} size="small">
                      <Avatar sx={{ background: 'linear-gradient(135deg, #165a9d 0%, #00a6a6 100%)' }}>
                        {user.name
                          .split(' ')
                          .map((word) => word[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }} transformOrigin={{ horizontal: 'right', vertical: 'top' }}>
                    <MenuItem disableRipple sx={{ cursor: 'default' }}>
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle2" fontWeight={600}>
                          {user.name}
                        </Typography>
                        <Chip label={user.role.toUpperCase()} color={user.role === 'admin' ? 'primary' : 'secondary'} size="small" sx={{ fontWeight: 700 }} />
                        <Typography variant="caption" color="text.secondary">
                          {user.email}
                        </Typography>
                      </Stack>
                    </MenuItem>
                    <Divider sx={{ my: 1 }} />
                    <MenuItem onClick={() => window.open('mailto:admin@pulsecare.com?subject=Support%20Request', '_blank')}>
                      Need help?
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        handleMenuClose();
                        logout();
                      }}
                    >
                      Sign out
                    </MenuItem>
                  </Menu>
                </Stack>
              </Stack>
            ) : (
              <Stack direction="row" spacing={1.5}>
                <Button component={RouterLink} to="/login" variant="outlined" color="primary" size="large">
                  Sign in
                </Button>
                <Button component={RouterLink} to="/signup" variant="contained" color="primary" size="large">
                  Sign up
                </Button>
              </Stack>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ flex: 1, py: 6 }}>
        {children}
      </Container>

      <Box component="footer" py={4} textAlign="center" color="text.secondary" fontSize="0.85rem">
        © {new Date().getFullYear()} PulseCare Hospital. All rights reserved.
      </Box>
    </Box>
  );
}

AppLayout.propTypes = {
  children: PropTypes.node
};
