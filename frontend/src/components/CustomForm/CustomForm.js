import "./CustomForm.css";
import axios from "axios";
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Link, Paper } from "@mui/material";

const CustomForm = ({ fields, buttonText, register, login }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      }
    } catch (error) {
      console.error("Error Occured:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Paper elevation={3} className="form-container">
        <Typography variant="h4">Register</Typography>
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
              Already have an account? <Link href="#">Log in</Link>
            </Typography>
          )}
          {login && (
            <Typography>
              Don't have an account yet? <Link href="#">Register</Link>
            </Typography>
          )}
        </Box>
      </Paper>
    </form>
  );
};

export default CustomForm;
