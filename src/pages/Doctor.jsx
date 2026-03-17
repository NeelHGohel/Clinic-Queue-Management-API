import React, { useEffect, useState } from "react";
import { getDoctorQueue } from "../services/queueService";
import { addPrescription, addReport } from "../services/medicalService";
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

function Doctor() {
  const [queue, setQueue] = useState([]);

  const [prescOpen, setPrescOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);

  const [prescData, setPrescData] = useState({
    medicines: "",
    dosage: "",
    duration: "",
    notes: "",
  });
  const [reportData, setReportData] = useState({
    diagnosis: "",
    tests: "",
    remarks: "",
  });

  useEffect(() => {
    const getTodaysQueue = async () => {
      const resp = await getDoctorQueue();
      if (Array.isArray(resp)) {
        setQueue(resp);
      }
    };
    getTodaysQueue();
  }, []);

  const handleOpenPresc = (id) => {
    setSelectedApptId(id);
    setPrescData({ medicines: "", dosage: "", duration: "", notes: "" });
    setPrescOpen(true);
  };

  const handleOpenReport = (id) => {
    setSelectedApptId(id);
    setReportData({ diagnosis: "", tests: "", remarks: "" });
    setReportOpen(true);
  };

  const handlePrescSubmit = (e) => {
    e.preventDefault();
    const payload = {
      medicines: [
        {
          name: prescData.medicines,
          dosage: prescData.dosage || "As prescribed",
          duration: prescData.duration || "Until finished",
        },
      ],
      notes: prescData.notes,
    };
    addPrescription(selectedApptId, payload)
      .then(() => {
        setPrescOpen(false);
        alert("Prescription added successfully!");
        return getDoctorQueue();
      })
      .then((data) => {
        if (Array.isArray(data)) setQueue(data);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to add prescription.");
      });
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();

    const reportPayload = {
      diagnosis: reportData.diagnosis,
      testRecommended: reportData.tests,
      remarks: reportData.remarks,
    };

    addReport(selectedApptId, reportPayload)
      .then(() => {
        setReportOpen(false);
        alert("Medical report saved successfully");
        return getDoctorQueue();
      })
      .then((updatedQueue) => {
        if (Array.isArray(updatedQueue)) setQueue(updatedQueue);
      })
      .catch((err) => {
        alert(err.response?.data?.message || "Error submitting report");
      });
  };

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Today's Queue Overview
      </Typography>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell>
                <strong>Token</strong>
              </TableCell>
              <TableCell>
                <strong>Patient Name</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {queue.map((q) => (
              <TableRow key={q.id}>
                <TableCell>
                  <Chip label={q.tokenNumber} color="primary" />
                </TableCell>
                <TableCell>
                  {q.patientName ||
                    q.appointment?.patient?.name ||
                    "Unknown Patient"}
                </TableCell>
                <TableCell>
                  <Chip
                    label={q.status}
                    color={
                      q.status === "done"
                        ? "success"
                        : q.status === "in-progress"
                          ? "warning"
                          : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpenPresc(q.appointmentId)}
                    sx={{ mr: 1 }}
                  >
                    Add Prescription
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    size="small"
                    onClick={() => handleOpenReport(q.appointmentId)}
                  >
                    Add Report
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {queue.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No patients in queue currently.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={prescOpen}
        onClose={() => setPrescOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Prescription</DialogTitle>
        <form onSubmit={handlePrescSubmit}>
          <DialogContent dividers>
            <TextField
              label="Medicine Name"
              fullWidth
              multiline
              rows={2}
              margin="dense"
              required
              value={prescData.medicines}
              onChange={(e) =>
                setPrescData({ ...prescData, medicines: e.target.value })
              }
            />
            <TextField
              label="Dosage"
              fullWidth
              margin="dense"
              required
              placeholder="e.g. 500mg"
              value={prescData.dosage}
              onChange={(e) =>
                setPrescData({ ...prescData, dosage: e.target.value })
              }
            />
            <TextField
              label="Duration"
              fullWidth
              margin="dense"
              required
              placeholder="e.g. 5 days"
              value={prescData.duration}
              onChange={(e) =>
                setPrescData({ ...prescData, duration: e.target.value })
              }
            />
            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              margin="dense"
              value={prescData.notes}
              onChange={(e) =>
                setPrescData({ ...prescData, notes: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPrescOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Add Report</DialogTitle>
        <form onSubmit={handleReportSubmit}>
          <DialogContent dividers>
            <TextField
              label="Diagnosis"
              fullWidth
              margin="dense"
              required
              value={reportData.diagnosis}
              onChange={(e) =>
                setReportData({ ...reportData, diagnosis: e.target.value })
              }
            />
            <TextField
              label="Tests"
              fullWidth
              margin="dense"
              multiline
              rows={2}
              value={reportData.tests}
              onChange={(e) =>
                setReportData({ ...reportData, tests: e.target.value })
              }
            />
            <TextField
              label="Remarks"
              fullWidth
              margin="dense"
              multiline
              rows={2}
              value={reportData.remarks}
              onChange={(e) =>
                setReportData({ ...reportData, remarks: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReportOpen(false)} color="inherit">
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="secondary">
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

export default Doctor;
