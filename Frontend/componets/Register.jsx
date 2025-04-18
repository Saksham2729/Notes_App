import * as React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  Snackbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import routes from "../helper/dummy";
import "../styles/login.css";

const FIELD_NAMES = {
  NAME: "name",
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
};

const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/
};

export default function RegisterFinal() {
  const url = 'http://localhost:5000/api/'
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = React.useState({});
  const [snack, setSnack] = React.useState({
    open: false,
    message: "",
    vertical: "bottom",
    horizontal: "left",
  });

  const [loading, setLoading] = React.useState(false);
  const { fields } = routes.register;
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/home');
    }
  }, [navigate]);

  const validate = (field, value) => {
    const newErrors = { ...errors };
    if (field === FIELD_NAMES.NAME) {
      if (!value.trim()) {
        newErrors.name = "Name is required";
      } else if (/\d/.test(value)) {
        newErrors.name = "Name cannot contain numbers";
      } else {
        newErrors.name = "";
      }
    }

    if (field === FIELD_NAMES.EMAIL) {
      newErrors.email = REGEX_PATTERNS.EMAIL.test(value) ? "" : "Invalid email address";
    }

    if (field === FIELD_NAMES.PASSWORD) {
      newErrors.password = REGEX_PATTERNS.PASSWORD.test(value)
      ? ""
      : "Password must be at least 8 characters, include a number and uppercase letter";
    }

    if (field === FIELD_NAMES.CONFIRM_PASSWORD) {
      newErrors.confirmPassword =
        value === formData.password ? "" : "Passwords do not match";
    }

    setErrors(newErrors);
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
    validate(field, value);
  };

  const showSnackbar = (message) => {
    setSnack({
      open: true,
      message,
      vertical: "bottom",
      horizontal: "left",
    });
  };

  const handleCloseSnackbar = () => {
    setSnack((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    Object.keys(formData).forEach((field) => validate(field, formData[field]));
    const hasErrors = Object.values(errors).some((error) => error);
    if (!hasErrors) {
      setLoading(true);
      try {
        const response = await axios.post(
          `${url}user/register`,
          formData
        );
        showSnackbar("Registration successful!");
        setTimeout(() => navigate("/login"), 2000);
      } catch (error) {
        console.error("Registration failed:", error);
        showSnackbar("Registration failed. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <main>
      <Paper
        elevation={3}
        className="register-container"
        sx={{
          width: 400,
          mx: "auto",
          my: 6,
          p: 4,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <Typography variant="h4" component="h1" className="register-heading">
          Register
        </Typography>

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type, placeholder }) => (
            <FormControl key={name} fullWidth sx={{ mb: 2 }}>
              <TextField
                label={label}
                name={name}
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange(name)}
                error={!!errors[name]}
                helperText={errors[name]}
              />
            </FormControl>
          ))}

          <Button
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>

        <Typography variant="body2" sx={{ mt: 2 }}>
          Already have an account?{" "}
          <Link to="/login" className="link-register">
            Login
          </Link>
        </Typography>
      </Paper>


      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: snack.vertical,
          horizontal: snack.horizontal,
        }}
        ContentProps={{
          sx: {
            backgroundColor: "#333",
            color: "#fff",
            fontWeight: "500",
          },
        }}
        message={snack.message}
        key="bottomleft"
      />
    </main>
  );
}
