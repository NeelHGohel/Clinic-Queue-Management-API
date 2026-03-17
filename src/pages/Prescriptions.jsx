import React, { useEffect, useState } from "react";
import { getMyPrescriptions } from "../services/medicalService";
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
} from "@mui/material";

function Prescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      getMyPrescriptions()
        .then((data) => {
          if (Array.isArray(data)) setPrescriptions(data);
        })
        .catch((err) => {
          alert(
            "Failed to fetch prescriptions: " +
              (err.response?.data?.message || err.message),
          );
        });
    };
    fetchPrescriptions();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        My Prescriptions
      </Typography>
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
                <strong>Medicines</strong>
              </TableCell>
              <TableCell>
                <strong>Notes</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {prescriptions.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {p.medicines?.map((m, idx) => (
                    <Box key={idx} sx={{ mb: 0.5 }}>
                      <Typography variant="body2" component="div">
                        • <strong>{m.name}</strong> - {m.dosage} ({m.duration})
                      </Typography>
                    </Box>
                  ))}
                </TableCell>
                <TableCell>{p.notes}</TableCell>
              </TableRow>
            ))}
            {prescriptions.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No prescriptions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Prescriptions;
