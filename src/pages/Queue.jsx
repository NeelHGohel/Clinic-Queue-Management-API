import React, { useEffect, useState } from "react";
import { getQueueByDate, updateQueueStatus } from "../services/queueService";
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
  TextField,
  Chip,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

function Queue() {
  const [queue, setQueue] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const loadQueue = async (fetchDate) => {
      const queueData = await getQueueByDate(fetchDate);
      if (Array.isArray(queueData)) {
        setQueue(queueData);
      } else {
        setQueue([]);
      }
    };
    loadQueue(date);
  }, [date]);

  const handleStatusChange = (id, newStatus) => {
    updateQueueStatus(id, newStatus)
      .then(() => getQueueByDate(date))
      .then((updatedQueue) =>
        setQueue(Array.isArray(updatedQueue) ? updatedQueue : []),
      )
      .catch((err) => {
        alert(err.response?.data?.message || "Failed to update queue status");
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
        <Typography variant="h4">Daily Queue</Typography>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          size="small"
        />
      </Box>

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
                <strong>Time Slot</strong>
              </TableCell>
              <TableCell>
                <strong>Status</strong>
              </TableCell>
              <TableCell>
                <strong>Action</strong>
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
                  {q.appointment?.patient?.name || "Unknown"}
                </TableCell>
                <TableCell>{q.appointment?.timeSlot || "N/A"}</TableCell>
                <TableCell>
                  <Chip
                    label={q.status}
                    color={
                      q.status === "done"
                        ? "success"
                        : q.status === "in-progress"
                          ? "warning"
                          : q.status === "skipped"
                            ? "error"
                            : "default"
                    }
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={q.status}
                      onChange={(e) => handleStatusChange(q.id, e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="waiting">Waiting</MenuItem>
                      <MenuItem value="in-progress">In Progress</MenuItem>
                      <MenuItem value="done">Done</MenuItem>
                      <MenuItem value="skipped">Skipped</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
              </TableRow>
            ))}
            {queue.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No queue entries for this date.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Queue;
