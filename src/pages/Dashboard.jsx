import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { getClinicInfo } from "../services/adminService";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
} from "@mui/material";

function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [clinicInfo, setClinicInfo] = useState(null);

  useEffect(() => {
    if (isAdmin) {
      const fetchClinicInfo = async () => {
        const data = await getClinicInfo();
        setClinicInfo(data);
      };
      fetchClinicInfo();
    }
  }, [isAdmin]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome, {user?.role}!
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Role: {user?.role.toUpperCase()} | Clinic: {user?.clinicId}
      </Typography>

      {isAdmin && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Clinic Overview ({user?.clinicName})
          </Typography>
          {clinicInfo ? (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Receptionists
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {clinicInfo.receptionistCount || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Doctors
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {clinicInfo.doctorCount || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card elevation={3}>
                  <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                      Total Patients
                    </Typography>
                    <Typography variant="h3" color="primary">
                      {clinicInfo.patientCount || 0}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          ) : (
            <Typography>No clinic info available.</Typography>
          )}
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
