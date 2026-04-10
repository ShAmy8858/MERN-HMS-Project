import React from 'react';
import { Link as RouterLink, Navigate, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

import { LoadingOverlay } from '../components/LoadingOverlay.jsx';
import { useAuth } from '../modules/auth/AuthContext.jsx';

const ROLE_OPTIONS = [
  {
    value: 'admin',
    label: 'Admin',
    description: 'Full control over the hospital dashboard',
    icon: <AdminPanelSettingsIcon fontSize="small" />
  },
  {
    value: 'manager',
    label: 'Hospital Manager',
    description: 'Coordinate appointments and teams',
    icon: <LocalHospitalIcon fontSize="small" />
  }
];

const INITIAL_FORM = {
  name: '',
  email: '',
  password: '',
  department: '',
  role: 'manager'
};

export default function SignupPage() {
  const { signup, isAuthenticating, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [formValues, setFormValues] = React.useState(INITIAL_FORM);
  const [rememberMe, setRememberMe] = React.useState(true);
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState(null);

  if (isAuthenticated) {
    return <Navigate to="/appointments" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);

    const result = await signup({ ...formValues, rememberMe });
    if (!result.success) {
      setError(result.message || 'Unable to create the account right now.');
      return;
    }

    navigate('/appointments', { replace: true });
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
                <Chip label="Create access" color="secondary" variant="outlined" sx={{ mb: 2 }} />
                <Typography variant="h3" sx={{ mb: 2, lineHeight: 1.05 }}>
                  Create a new PulseCare account.
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 430 }}>
                  Register an admin or hospital manager profile, save it in the database, and sign in immediately after creating it.
                </Typography>
              </Box>

              <Stack spacing={2}>
                {[
                  'Public signup is limited to admin and hospital manager roles',
                  'New accounts are stored in MongoDB with secure password hashes',
                  'You can sign in right after registration without leaving the flow'
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
                    <Typography variant="overline" color="secondary.main" fontWeight={700} letterSpacing={1.8}>
                      Sign up
                    </Typography>
                    <Typography variant="h4" sx={{ mt: 0.5 }}>
                      Register a new account
                    </Typography>
                  </Box>

                  {error ? <Alert severity="error">{error}</Alert> : null}

                  <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Stack spacing={2.5}>
                      <TextField
                        name="name"
                        type="text"
                        label="Full Name"
                        required
                        fullWidth
                        value={formValues.name}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonOutlineIcon color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />

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

                      <TextField
                        name="department"
                        type="text"
                        label="Department"
                        placeholder="Operations, Administration, Cardiology"
                        required
                        fullWidth
                        value={formValues.department}
                        onChange={handleChange}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <BusinessCenterIcon color="primary" />
                            </InputAdornment>
                          )
                        }}
                      />

                      <FormControl fullWidth>
                        <InputLabel id="role-select-label">Account Role</InputLabel>
                        <Select
                          labelId="role-select-label"
                          name="role"
                          label="Account Role"
                          value={formValues.role}
                          onChange={handleChange}
                          MenuProps={{ PaperProps: { sx: { borderRadius: 4 } } }}
                        >
                          {ROLE_OPTIONS.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              <Stack spacing={0.25}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Box sx={{ color: 'primary.main', display: 'grid', placeItems: 'center' }}>{option.icon}</Box>
                                  <Typography variant="subtitle2" fontWeight={700}>
                                    {option.label}
                                  </Typography>
                                </Stack>
                                <Typography variant="caption" color="text.secondary">
                                  {option.description}
                                </Typography>
                              </Stack>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                        <FormControlLabel
                          control={<Checkbox checked={rememberMe} onChange={(event) => setRememberMe(event.target.checked)} />}
                          label="Remember device"
                        />
                        <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
                          Already have an account? Sign in
                        </Link>
                      </Stack>

                      <Button type="submit" variant="contained" size="large" startIcon={<PersonAddAltIcon />}>
                        Create account
                      </Button>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 1 }}>
                    <Chip label="What happens next" variant="outlined" sx={{ letterSpacing: 1 }} />
                  </Divider>

                  <Grid container spacing={2}>
                    {[
                      'Your password is hashed before it reaches MongoDB',
                      'Successful signup signs you in immediately',
                      'The account can be reused on the login screen right away'
                    ].map((item) => (
                      <Grid item xs={12} sm={4} key={item}>
                        <Paper
                          elevation={0}
                          sx={{
                            height: '100%',
                            p: 2,
                            borderRadius: 4,
                            bgcolor: 'rgba(0, 166, 166, 0.05)',
                            border: '1px solid rgba(0, 166, 166, 0.1)'
                          }}
                        >
                          <Typography variant="body2" fontWeight={600}>
                            {item}
                          </Typography>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {isAuthenticating ? <LoadingOverlay message="Creating your account" /> : null}
      </Box>
    </Fade>
  );
}
