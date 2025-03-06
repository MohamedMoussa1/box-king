import "./CustomForm.css";
import axios from "axios";
import { useState } from "react";
import { Box, TextField, Button, Typography, Paper } from "@mui/material";
import { useUser } from "../../context/UserContext";
import { Link, useNavigate } from "react-router-dom";

const CustomForm = ({
  fields,
  header,
  buttonText,
  errors,
  register,
  login,
  createBox,
}) => {
  const { setUser } = useUser();
  const navigate = useNavigate();
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
        navigate("/login");
      } else if (login) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/box-king/login`,
          formData,
          { withCredentials: true }
        );
        setUser({ username: formData.email });
      } else if (createBox) {
        await axios.post(
          `${process.env.REACT_APP_API_URL}/box-king/box`,
          formData,
          { withCredentials: true }
        );
        navigate("/dashboard");
      }
    } catch (error) {
      const response = error.response;
      if (login && error.status === 400) {
        setformErrors((prevErrors) => ({
          ...prevErrors,
          invalidCredentials: true,
        }));
      } else if (
        createBox &&
        response.data.error_type === "integrity_error" &&
        response.data.message.includes("unique_box_name_per_user")
      ) {
        setformErrors((prevErrors) => ({
          ...prevErrors,
          duplicateBoxName: true,
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
        {formErrors.duplicateBoxName && (
          <Typography className="error-container">
            Oops! A box with this name already exists. Please choose a different
            name.
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
              slotProps={{
                htmlInput: { maxLength: field.maxLength || "unset" },
              }}
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
