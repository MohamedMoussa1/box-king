import "./Register.css";
import { Box } from "@mui/material";
import useRedirectIfLoggedIn from "../../hooks/useRedirectIfLoggedIn";
import CustomForm from "../../components/CustomForm/CustomForm";

const Register = () => {
  const { checkingIfLoggedIn } = useRedirectIfLoggedIn();
  const fields = [
    { name: "first_name", label: "First Name", type: "text", required: true },
    { name: "last_name", label: "Last Name", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const header = "Register";
  const buttonText = "Get Started";
  const errors = ["existingUser"];
  const register = true;

  if (checkingIfLoggedIn) return null;

  return (
    <Box className="page-container">
      <Box className="register-container">
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
            header={header}
            buttonText={buttonText}
            errors={errors}
            register={register}
          ></CustomForm>
        </Box>
      </Box>
    </Box>
  );
};

export default Register;
