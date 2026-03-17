import React, { useEffect, useState } from "react";
import {
  getMyAppointments,
  bookAppointment,
  getAppointmentById,
} from "../services/appointmentsService";
import { useAuth } from "../context/AuthProvider";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    appointmentDate: "",
    timeSlot: "",
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const { isPatient } = useAuth();

  useEffect(() => {
    const fetchAppointments = async () => {
      const data = await getMyAppointments();
      if (Array.isArray(data)) {
        setAppointments(data);
      }
    };
    fetchAppointments();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenDetails = (id) => {
    setDetailsLoading(true);
    setDetailsOpen(true);
    getAppointmentById(id)
      .then((data) => {
        setSelectedAppt(data);
        setDetailsLoading(false);
      })
      .catch((err) => {
        setDetailsLoading(false);
        alert("Failed to load appointment details.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    bookAppointment(formData)
      .then(() => {
        setOpen(false);
        setFormData({ appointmentDate: "", timeSlot: "" });
        return getMyAppointments();
      })
      .then((data) => {
        if (Array.isArray(data)) setAppointments(data);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Invalid appointment details.");
      });
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h4">Appointments</Typography>
        {isPatient && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpen(true)}
          >
            Book Appointment
          </Button>
        )}
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>ID</strong>
              </TableCell>
              <TableCell>
                <strong>Date</strong>
              </TableCell>
              <TableCell>
                <strong>Time Slot</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Queue Token</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.id}</TableCell>
                <TableCell>{appt.appointmentDate}</TableCell>
                <TableCell>{appt.timeSlot}</TableCell>
                <TableCell>
                  <Chip
                    label={appt.status}
                    color={appt.status === "scheduled" ? "success" : "default"}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {appt.queueEntry ? (
                    <Chip
                      label={`Token: ${appt.queueEntry.tokenNumber}`}
                      color="primary"
                      size="small"
                    />
                  ) : (
                    "N/A"
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    onClick={() => handleOpenDetails(appt.id)}
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {appointments.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No appointments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Appointment Details (ID: {selectedAppt?.id})</DialogTitle>
        <DialogContent dividers>
          {detailsLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : selectedAppt ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Medical Report
              </Typography>
              {selectedAppt.report ? (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body1">
                    <strong>Diagnosis:</strong> {selectedAppt.report.diagnosis}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Tests Recommended:</strong>{" "}
                    {selectedAppt.report.testRecommended || "None"}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Remarks:</strong>{" "}
                    {selectedAppt.report.remarks || "No remarks"}
                  </Typography>
                </Box>
              ) : (
                <Typography color="textSecondary" sx={{ mb: 3 }}>
                  No report available yet.
                </Typography>
              )}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Prescription
              </Typography>
              {selectedAppt.prescription ? (
                <Box>
                  <Typography variant="subtitle1" gutterBottom>
                    Medicines:
                  </Typography>
                  {selectedAppt.prescription.medicines?.map((m, idx) => (
                    <Typography key={idx} variant="body2" sx={{ ml: 2 }}>
                      • <strong>{m.name}</strong> - {m.dosage} ({m.duration})
                    </Typography>
                  ))}
                  <Typography variant="body1" sx={{ mt: 2 }}>
                    <strong>Notes:</strong>{" "}
                    {selectedAppt.prescription.notes || "None"}
                  </Typography>
                </Box>
              ) : (
                <Typography color="textSecondary">
                  No prescription available yet.
                </Typography>
              )}
            </Box>
          ) : (
            <Typography>Error loading details.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Book Appointment</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent dividers>
            <TextField
              margin="dense"
              label="Appointment Date"
              name="appointmentDate"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.appointmentDate}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              label="Time Slot (e.g. 10:00-10:15)"
              name="timeSlot"
              fullWidth
              required
              placeholder="10:00-10:15"
              value={formData.timeSlot}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Book
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Appointments;
