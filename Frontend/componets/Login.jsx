import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  FormControl,
  Snackbar,
} from '@mui/material';
import '../styles/login.css';

const LoginFinal = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });
  const navigate = useNavigate();
  const url='http://localhost:5000/api/';

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      navigate('/home');
    }
  }, [navigate]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { email, password } = formData;
      const { data } = await axios.post(`${url}user/login`, {
        email,
        password,
      });

      localStorage.setItem('userId', data.userId);
      localStorage.setItem('token', data.token);

      setSnackbar({ open: true, message: 'Logged in successfully!' });
      setTimeout(() => navigate('/home'), 1500);
    } catch (error) {
      setSnackbar({ open: true, message: 'Login failed. Please check your credentials.' });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <main>
      <Paper elevation={3} className="login-container">
        <Box mb={3}>
          <Typography variant="h4" component="h1" className="login-heading">
            Login
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
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
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            message={snackbar.message}
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
