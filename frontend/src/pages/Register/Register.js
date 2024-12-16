import "./Register.css";
import { Box } from "@mui/material";
import CustomForm from "../../components/CustomForm/CustomForm";

const Register = () => {
  const fields = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const buttonText = "Get Started";
  const register = true;

  return (
    <Box className="page-container register-container">
      <Box className="img-container">
        <img
          src="/assets/box_tracking.jpg"
          alt="Box King"
          className="register-img"
        />
      </Box>
      <Box className="custom-form-container">
        <CustomForm
          fields={fields}
          buttonText={buttonText}
          register={register}
        ></CustomForm>
      </Box>
    </Box>
  );
};

export default Register;
