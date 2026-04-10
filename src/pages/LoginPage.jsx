import React from 'react';
import { Link as RouterLink, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';

import { LoadingOverlay } from '../components/LoadingOverlay.jsx';
import { useAuth } from '../modules/auth/AuthContext.jsx';

const CREDENTIAL_HINTS = [
  { role: 'Admin', email: 'admin@pulsecare.com', password: 'Admin@123', icon: <AdminPanelSettingsIcon fontSize="small" /> },
  { role: 'Hospital Manager', email: 'manager@pulsecare.com', password: 'Manager@123', icon: <LocalHospitalIcon fontSize="small" /> },
  { role: 'Staff', email: 'staff@pulsecare.com', password: 'Staff@123', icon: <SupportAgentIcon fontSize="small" /> }
];

export default function LoginPage() {
  const { login, isAuthenticating, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname ?? '/appointments';

  const [formValues, setFormValues] = React.useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [error, setError] = React.useState(null);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    const result = await login({ ...formValues, rememberMe });
    if (!result.success) {
      setError(result.message || 'Unable to sign in right now.');
      return;
    }
    navigate(redirectTo, { replace: true });
  };

  return (
    <Fade in timeout={700}>
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 6,
          px: { xs: 2, md: 4 },
          py: { xs: 3, md: 5 },
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.74) 0%, rgba(243,248,255,0.9) 45%, rgba(228,247,247,0.88) 100%)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 25px 70px rgba(22, 90, 157, 0.14)',
          backdropFilter: 'blur(18px)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 12% 18%, rgba(0,166,166,0.18), transparent 28%), radial-gradient(circle at 88% 16%, rgba(22,90,157,0.16), transparent 30%), radial-gradient(circle at 70% 90%, rgba(0,166,166,0.12), transparent 26%)'
          }}
        />

        <Grid container spacing={4} alignItems="stretch" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid item xs={12} md={5}>
            <Stack spacing={3} sx={{ height: '100%', justifyContent: 'space-between' }}>
              <Box>
                <Chip label="Secure access" color="primary" variant="outlined" sx={{ mb: 2 }} />
                <Typography variant="h3" sx={{ mb: 2, lineHeight: 1.05 }}>
                  Welcome back to PulseCare.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 430 }}>
                  Sign in to manage appointments, monitor care teams, and keep every department aligned.
                </Typography>
              </Box>

              <Stack spacing={2}>
                {[
                  'Fast access to appointments and admin tools',
                  'Glassy, responsive interface with clear actions',
                  'Registered accounts stay in MongoDB for future visits'
                ].map((item) => (
                  <Paper
                    key={item}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 4,
                      bgcolor: 'rgba(255,255,255,0.55)',
                      border: '1px solid rgba(255,255,255,0.75)'
                    }}
                  >
                    <Typography variant="body2" fontWeight={600}>
                      {item}
                    </Typography>
                  </Paper>
                ))}
              </Stack>
            </Stack>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card
              elevation={0}
              sx={{
                height: '100%',
                borderRadius: 5,
                overflow: 'hidden',
                bgcolor: 'rgba(255,255,255,0.72)',
                border: '1px solid rgba(255,255,255,0.8)',
                backdropFilter: 'blur(22px)'
              }}
            >
              <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="overline" color="primary.main" fontWeight={700} letterSpacing={1.8}>
                      Sign in
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5 }}>
                      Access your workspace
                    </Typography>
                  </Box>

                  {error ? <Alert severity="error">{error}</Alert> : null}

                  <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Stack spacing={2.5}>
                      <TextField
                        name="email"
                        type="email"
                        label="Work Email"
                        placeholder="you@pulsecare.com"
                        required
                        fullWidth
                        value={formValues.email}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <MailOutlineIcon color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        label="Password"
                        required
                        fullWidth
                        value={formValues.password}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="primary" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button onClick={() => setShowPassword((prev) => !prev)} size="small">
                                {showPassword ? 'Hide' : 'Show'}
                              </Button>
                            </InputAdornment>
                          )
                        }}
                      />

                      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <FormControlLabel
                          control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
                          label="Remember device"
                        />
                        <Link component={RouterLink} to="/signup" underline="hover" fontWeight={600}>
                          New user? Create an account
                        </Link>
                      </Stack>

                      <Button type="submit" variant="contained" size="large" startIcon={<LoginIcon />}>
                        Sign in
                      </Button>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 1 }}>
                    <Chip label="Demo accounts" variant="outlined" sx={{ letterSpacing: 1 }} />
                  </Divider>

                  <Grid container spacing={2}>
                    {CREDENTIAL_HINTS.map((hint) => (
                      <Grid item xs={12} sm={4} key={hint.role}>
                        <Paper
                          elevation={0}
                          sx={{
                            height: '100%',
                            p: 2,
                            borderRadius: 4,
                            bgcolor: 'rgba(22, 90, 157, 0.04)',
                            border: '1px solid rgba(22, 90, 157, 0.08)'
                          }}
                        >
                          <Stack spacing={1}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <Box
                                sx={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 2,
                                  display: 'grid',
                                  placeItems: 'center',
                                  bgcolor: 'rgba(22, 90, 157, 0.12)',
                                  color: 'primary.main'
                                }}
                              >
                                {hint.icon}
                              </Box>
                              <Typography variant="subtitle2" fontWeight={700}>
                                {hint.role}
                              </Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary">
                              {hint.email}
                            </Typography>
                            <Typography variant="body2" fontWeight={600}>
                              {hint.password}
                            </Typography>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isAuthenticating ? <LoadingOverlay message="Authenticating your account" /> : null}
      </Box>
    </Fade>
  );
}
