import React, { useEffect, useState } from "react";
import { getMyReports } from "../services/medicalService";
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

function Reports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      getMyReports()
        .then((data) => {
          if (Array.isArray(data)) setReports(data);
        })
        .catch((err) => {
          alert(
            "Failed to fetch reports: " +
              (err.response?.data?.message || err.message),
          );
        });
    };
    fetchReports();
  }, []);

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        My Reports
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
                <strong>Diagnosis</strong>
              </TableCell>
              <TableCell>
                <strong>Tests</strong>
              </TableCell>
              <TableCell>
                <strong>Remarks</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.id}</TableCell>
                <TableCell>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "N/A"}
                </TableCell>
                <TableCell>{r.diagnosis}</TableCell>
                <TableCell>{r.testRecommended}</TableCell>
                <TableCell>{r.remarks}</TableCell>
              </TableRow>
            ))}
            {reports.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No reports found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default Reports;
