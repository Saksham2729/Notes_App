import * as React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";
import { Link } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';

import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
} from '@mui/material';

const LoginFinal = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/user/login', {
        email,
        password,
      });

      // Assuming the response contains userId
      const { userId, token } = response.data;

      // Store userId in localStorage

      localStorage.setItem('userId', userId);
      localStorage.setItem('token', token);


      setSnackbarMsg('Logged in successfully!');
      setOpen(true);
      setTimeout(() => navigate('/'), 1500); 
    } catch (error) {
      setSnackbarMsg('Login failed. Please check your credentials.');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <main>
      <Paper elevation={3} className="login-container">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" className="login-heading">
            Login
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="login-button"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>

          <Snackbar
            open={open}
            autoHideDuration={3000}
            onClose={handleClose}
            message={snackbarMsg}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          />
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Don&apos;t have an account?{' '}
          <Link to="/register" className="link-register">
            Register
          </Link>
        </Typography>
      </Paper>
    </main>
  );
};

export default LoginFinal;

