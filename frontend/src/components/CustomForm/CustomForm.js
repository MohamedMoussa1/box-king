import "./CustomForm.css";
import axios from "axios";
import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";

const CustomForm = ({
  fields,
  header,
  buttonText,
  errors,
  register,
  login,
}) => {
  const { setUser } = useUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setformErrors] = useState(
    (errors ?? []).reduce((acc, error) => ({ ...acc, [error]: false }), {})
  );
  const [formData, setFormData] = useState(
    fields.reduce((acc, field) => ({ ...acc, [field.name]: "" }), {})
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (register) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/box-king/user`,
          formData
        );
      } else if (login) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/box-king/login`,
          formData,
          { withCredentials: true }
        );
        setUser({ username: formData.email });
      }
    } catch (error) {
      if (login && error.status === 400) {
        setformErrors((prevErrors) => ({
          ...prevErrors,
          invalidCredentials: true,
        }));
      }
      console.error("Error Occured:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} className="form-container">
        <Typography variant="h4">{header}</Typography>
        {formErrors.invalidCredentials && (
          <Typography className="error-container">
            Your email or password was incorrect. Please try again.
          </Typography>
        )}
        <Box className="fields-container">
          {fields.map((field, index) => (
            <TextField
              key={index}
              required={field.required}
              name={field.name}
              label={field.label}
              type={field.type}
              variant="outlined"
              className="field"
              value={formData[field.name]}
              onChange={handleInputChange}
              fullWidth
            />
          ))}
        </Box>
        <Box className="form-footer">
          <Button
            variant="contained"
            type="submit"
            disabled={isSubmitting}
            className="submit-button"
          >
            {buttonText}
          </Button>
          {register && (
            <Typography>
              Already have an account? <Link to="/login">Login</Link>
            </Typography>
          )}
          {login && (
            <Typography>
              Don't have an account yet? <Link to="/register">Register</Link>
            </Typography>
          )}
        </Box>
      </Paper>
    </form>
  );
};

export default CustomForm;
