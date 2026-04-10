import React from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { useAuth } from "../modules/auth/AuthContext.jsx";
import { appointmentService } from "../services/appointmentService.js";
import { userService } from "../services/userService.js";
import { AppointmentStatusChip } from "../components/AppointmentStatusChip.jsx";

const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];
const ROLE_OPTIONS = ["admin", "manager", "staff"];

const INITIAL_APPOINTMENT_FORM = {
  patientName: "",
  patientId: "",
  department: "",
  doctor: "",
  reason: "",
  scheduledAt: "",
  notes: ""
};

const INITIAL_USER_FORM = {
  name: "",
  email: "",
  department: "",
  role: "staff",
  password: ""
};

export default function AdminPage() {
  const { token } = useAuth();

  const [appointments, setAppointments] = React.useState([]);
  const [formValues, setFormValues] = React.useState(INITIAL_APPOINTMENT_FORM);
  const [error, setError] = React.useState(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isFetchingAppointments, setIsFetchingAppointments] = React.useState(false);
  const [statusUpdate, setStatusUpdate] = React.useState({});
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);
  const [editDialog, setEditDialog] = React.useState({ open: false, appointmentId: null });
  const [editValues, setEditValues] = React.useState({ ...INITIAL_APPOINTMENT_FORM, status: STATUS_OPTIONS[0] });
  const [editError, setEditError] = React.useState(null);
  const [isSavingEdit, setIsSavingEdit] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, appointmentId: null });
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({ open: false, message: "", severity: "success" });

  const [users, setUsers] = React.useState([]);
  const [userFormValues, setUserFormValues] = React.useState(INITIAL_USER_FORM);
  const [userFormError, setUserFormError] = React.useState(null);
  const [userListError, setUserListError] = React.useState(null);
  const [isCreatingUser, setIsCreatingUser] = React.useState(false);
  const [isFetchingUsers, setIsFetchingUsers] = React.useState(false);

  const loadAppointments = React.useCallback(async () => {
    if (!token) {
      setAppointments([]);
      return;
    }

    setIsFetchingAppointments(true);
    try {
      const data = await appointmentService.list(token);
      setAppointments(data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load admin data");
    } finally {
      setIsFetchingAppointments(false);
    }
  }, [token]);

  const loadUsers = React.useCallback(async () => {
    if (!token) {
      setUsers([]);
      return;
    }

    setIsFetchingUsers(true);
    try {
      const data = await userService.list(token);
      setUsers(data);
      setUserListError(null);
    } catch (err) {
      setUserListError(err.message || "Failed to load users");
    } finally {
      setIsFetchingUsers(false);
    }
  }, [token]);

  React.useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    setError(null);

    if (!token) {
      setError("Authentication required");
      return;
    }

    const missingField = Object.entries(formValues).find(([, value]) => value.trim() === "");
    if (missingField) {
      setError("Please fill in all fields before creating an appointment.");
      return;
    }

    setIsSubmitting(true);
    try {
      await appointmentService.create(token, {
        ...formValues,
        scheduledAt: new Date(formValues.scheduledAt).toISOString()
      });
      setFormValues(INITIAL_APPOINTMENT_FORM);
      await loadAppointments();
      setSnackbar({ open: true, message: "Appointment created successfully", severity: "success" });
    } catch (err) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (appointmentId, nextStatus) => {
    if (!token) {
      setSnackbar({ open: true, message: "Authentication required", severity: "error" });
      return;
    }

    setIsUpdatingStatus(true);
    setStatusUpdate({ appointmentId, nextStatus });
    try {
      await appointmentService.updateStatus(token, appointmentId, nextStatus);
      await loadAppointments();
      setSnackbar({ open: true, message: "Status updated", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Unable to update status", severity: "error" });
    } finally {
      setIsUpdatingStatus(false);
      setStatusUpdate({});
    }
  };

  const toDateTimeLocal = (value) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    const pad = (input) => String(input).padStart(2, "0");
    const localYear = date.getFullYear();
    const localMonth = pad(date.getMonth() + 1);
    const localDay = pad(date.getDate());
    const localHours = pad(date.getHours());
    const localMinutes = pad(date.getMinutes());
    return `${localYear}-${localMonth}-${localDay}T${localHours}:${localMinutes}`;
  };

  const openEditDialog = (appointment) => {
    setEditDialog({ open: true, appointmentId: appointment.id });
    setEditValues({
      patientName: appointment.patientName,
      patientId: appointment.patientId,
      department: appointment.department,
      doctor: appointment.doctor,
      reason: appointment.reason,
      scheduledAt: toDateTimeLocal(appointment.scheduledAt),
      notes: appointment.notes,
      status: appointment.status
    });
    setEditError(null);
  };

  const closeEditDialog = () => {
    setEditDialog({ open: false, appointmentId: null });
    setIsSavingEdit(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    setEditError(null);

    if (!token) {
      setEditError("Authentication required");
      return;
    }

    const missingField = Object.entries(editValues).find(([, value]) => value.trim() === "");
    if (missingField) {
      setEditError("Please complete every field before saving changes.");
      return;
    }

    setIsSavingEdit(true);
    try {
      await appointmentService.update(token, editDialog.appointmentId, {
        ...editValues,
        scheduledAt: new Date(editValues.scheduledAt).toISOString()
      });
      closeEditDialog();
      await loadAppointments();
      setSnackbar({ open: true, message: "Appointment updated", severity: "success" });
    } catch (err) {
      setEditError(err.message || "Failed to update appointment");
      setIsSavingEdit(false);
    }
  };

  const openDeleteDialog = (appointmentId) => {
    setDeleteDialog({ open: true, appointmentId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, appointmentId: null });
    setIsDeleting(false);
  };

  const handleDelete = async () => {
    if (!deleteDialog.appointmentId) {
      return;
    }

    if (!token) {
      setSnackbar({ open: true, message: "Authentication required", severity: "error" });
      return;
    }

    setIsDeleting(true);
    try {
      await appointmentService.remove(token, deleteDialog.appointmentId);
      closeDeleteDialog();
      await loadAppointments();
      setSnackbar({ open: true, message: "Appointment deleted", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Failed to delete appointment", severity: "error" });
      setIsDeleting(false);
    }
  };

  const handleUserFormChange = (event) => {
    const { name, value } = event.target;
    setUserFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setUserFormError(null);

    if (!token) {
      setUserFormError("Authentication required");
      return;
    }

    const missingField = Object.entries(userFormValues).find(([, value]) => value.trim() === "");
    if (missingField) {
      setUserFormError("Please complete all user fields before submitting.");
      return;
    }

    setIsCreatingUser(true);
    try {
      await userService.create(token, userFormValues);
      setUserFormValues(INITIAL_USER_FORM);
      await loadUsers();
      setSnackbar({ open: true, message: "User account created", severity: "success" });
    } catch (err) {
      setUserFormError(err.message || "Failed to create user");
    } finally {
      setIsCreatingUser(false);
    }
  };

  const closeSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Stack spacing={4}>
      <Box>
        <Typography variant="h3" fontWeight={700} gutterBottom>
          Admin control center
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage appointments, coordinate departments, and keep patients informed with real-time updates.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card component="form" onSubmit={handleCreate}>
            {isSubmitting ? <LinearProgress /> : null}
            <CardHeader
              title={<Typography variant="h5">Create new appointment</Typography>}
              subheader="Capture patient details and assign the appropriate specialist."
              avatar={<PlaylistAddIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                {error ? <Alert severity="error">{error}</Alert> : null}
                <TextField
                  name="patientName"
                  label="Patient full name"
                  value={formValues.patientName}
                  onChange={handleFormChange}
                  required
                  fullWidth
                />
                <TextField
                  name="patientId"
                  label="Patient ID"
                  value={formValues.patientId}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  name="department"
                  label="Department"
                  value={formValues.department}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  name="doctor"
                  label="Assigned physician"
                  value={formValues.doctor}
                  onChange={handleFormChange}
                  required
                />
                <TextField
                  name="reason"
                  label="Visit reason"
                  value={formValues.reason}
                  onChange={handleFormChange}
                  required
                  multiline
                  minRows={2}
                />
                <TextField
                  name="scheduledAt"
                  label="Scheduled date and time"
                  type="datetime-local"
                  value={formValues.scheduledAt}
                  onChange={handleFormChange}
                  required
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  name="notes"
                  label="Nurse notes"
                  value={formValues.notes}
                  onChange={handleFormChange}
                  required
                  multiline
                  minRows={3}
                />
                <Button type="submit" variant="contained" size="large" disabled={isSubmitting} startIcon={<AssignmentTurnedInIcon />}>
                  Create appointment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            {isUpdatingStatus || isFetchingAppointments ? <LinearProgress color="secondary" /> : null}
            <CardHeader
              title={<Typography variant="h5">Manage schedule</Typography>}
              subheader="Update statuses to ensure every patient receives timely care."
              avatar={<FactCheckIcon color="secondary" />}
            />
            <Divider />
            <CardContent>
              {appointments.length === 0 ? (
                <Alert severity="info">No appointments available yet.</Alert>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Patient</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Scheduled</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment.id} hover>
                          <TableCell>
                            <Stack spacing={0.5}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {appointment.patientName}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {appointment.patientId}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Chip label={appointment.department} size="small" color="secondary" />
                          </TableCell>
                          <TableCell>
                            {new Date(appointment.scheduledAt).toLocaleString(undefined, {
                              dateStyle: "medium",
                              timeStyle: "short"
                            })}
                          </TableCell>
                          <TableCell>
                            <AppointmentStatusChip status={appointment.status} isOverdue={appointment.isOverdue} />
                          </TableCell>
                          <TableCell align="right">
                            <Stack spacing={1} alignItems="flex-end">
                              <TextField
                                select
                                size="small"
                                sx={{ minWidth: 150 }}
                                value={statusUpdate.appointmentId === appointment.id ? statusUpdate.nextStatus : appointment.status}
                                onChange={(event) => handleStatusChange(appointment.id, event.target.value)}
                                disabled={isUpdatingStatus && statusUpdate.appointmentId === appointment.id}
                              >
                                {STATUS_OPTIONS.map((option) => (
                                  <MenuItem key={option} value={option}>
                                    {option.charAt(0).toUpperCase() + option.slice(1)}
                                  </MenuItem>
                                ))}
                              </TextField>
                              <Stack direction="row" spacing={1}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<EditIcon />}
                                  onClick={() => openEditDialog(appointment)}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<DeleteForeverIcon />}
                                  onClick={() => openDeleteDialog(appointment.id)}
                                  disabled={isDeleting && deleteDialog.appointmentId === appointment.id}
                                >
                                  Delete
                                </Button>
                              </Stack>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid item xs={12} md={5}>
          <Card component="form" onSubmit={handleCreateUser}>
            {isCreatingUser ? <LinearProgress /> : null}
            <CardHeader
              title={<Typography variant="h5">Add team member</Typography>}
              subheader="Provision access for clinicians and admins."
              avatar={<GroupAddIcon color="primary" />}
            />
            <Divider />
            <CardContent>
              <Stack spacing={2.5}>
                {userFormError ? <Alert severity="error">{userFormError}</Alert> : null}
                <TextField
                  name="name"
                  label="Full name"
                  value={userFormValues.name}
                  onChange={handleUserFormChange}
                  required
                  fullWidth
                />
                <TextField
                  name="email"
                  label="Email"
                  type="email"
                  value={userFormValues.email}
                  onChange={handleUserFormChange}
                  required
                  fullWidth
                />
                <TextField
                  name="department"
                  label="Department"
                  value={userFormValues.department}
                  onChange={handleUserFormChange}
                  required
                  fullWidth
                />
                <TextField
                  name="role"
                  label="Role"
                  select
                  value={userFormValues.role}
                  onChange={handleUserFormChange}
                  required
                >
                  {ROLE_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.charAt(0).toUpperCase() + option.slice(1)}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  name="password"
                  label="Temporary password"
                  type="password"
                  value={userFormValues.password}
                  onChange={handleUserFormChange}
                  required
                  helperText="Share this password securely with the user."
                />
                <Button type="submit" variant="contained" size="large" disabled={isCreatingUser} startIcon={<GroupAddIcon />}>
                  Create user
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card>
            {isFetchingUsers ? <LinearProgress /> : null}
            <CardHeader
              title={<Typography variant="h5">Team directory</Typography>}
              subheader="Review who has access and their assigned roles."
              avatar={<PeopleAltIcon color="secondary" />}
            />
            <Divider />
            <CardContent>
              {userListError ? <Alert severity="error">{userListError}</Alert> : null}
              {users.length === 0 && !userListError ? (
                <Alert severity="info">No users found. Add your care team to get started.</Alert>
              ) : null}
              {users.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Department</TableCell>
                        <TableCell>Created</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user._id || user.id} hover>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight={600}>
                              {user.name}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">{user.email}</Typography>
                          </TableCell>
                          <TableCell>
                            <Chip label={user.role?.toUpperCase()} size="small" color={user.role === "admin" ? "primary" : "default"} />
                          </TableCell>
                          <TableCell>{user.department}</TableCell>
                          <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : null}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={editDialog.open} onClose={isSavingEdit ? undefined : closeEditDialog} fullWidth maxWidth="sm">
        <Box component="form" onSubmit={handleEditSubmit} noValidate>
          <DialogTitle>Edit appointment</DialogTitle>
          <DialogContent dividers>
            <Stack spacing={2.5} mt={1}>
              {editError ? <Alert severity="error">{editError}</Alert> : null}
              <TextField name="patientName" label="Patient full name" value={editValues.patientName} onChange={handleEditChange} required fullWidth />
              <TextField name="patientId" label="Patient ID" value={editValues.patientId} onChange={handleEditChange} required />
              <TextField name="department" label="Department" value={editValues.department} onChange={handleEditChange} required />
              <TextField name="doctor" label="Assigned physician" value={editValues.doctor} onChange={handleEditChange} required />
              <TextField name="reason" label="Visit reason" value={editValues.reason} onChange={handleEditChange} required multiline minRows={2} />
              <TextField
                name="scheduledAt"
                label="Scheduled date and time"
                type="datetime-local"
                value={editValues.scheduledAt}
                onChange={handleEditChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField name="notes" label="Nurse notes" value={editValues.notes} onChange={handleEditChange} required multiline minRows={3} />
              <TextField name="status" label="Status" select value={editValues.status} onChange={handleEditChange} required>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeEditDialog} disabled={isSavingEdit}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSavingEdit}>
              Save changes
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Dialog open={deleteDialog.open} onClose={isDeleting ? undefined : closeDeleteDialog}>
        <DialogTitle>Delete appointment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This appointment will be permanently removed from the schedule. Are you sure you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={isDeleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </Stack>
  );
}
