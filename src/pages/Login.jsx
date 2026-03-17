import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/authService";
import { useAuth } from "../context/AuthProvider";

function LoginPage() {
  const { loginAuth } = useAuth();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const res = await loginService(loginData);

    if (res.error) {
      setError(res.message);
    } else {
      const tokenParts = res.token.split(".");
      loginAuth(atob(tokenParts[1]));
      navigate("/dashboard");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Clinic Queue Management API
          </Typography>

          <Typography
            component="h2"
            variant="h6"
            align="center"
            color="textSecondary"
            gutterBottom
          >
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              label="email"
              autoFocus
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default LoginPage;
