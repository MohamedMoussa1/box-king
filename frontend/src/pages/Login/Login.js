import "./Login.css";
import { Box } from "@mui/material";
import CustomForm from "../../components/CustomForm/CustomForm";
import Banner from "../../components/Banner/Banner";

const Login = () => {
  const fields = [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const header = "Login";
  const buttonText = "Login";
  const errors = ["invalidCredentials"];
  const login = true;

  return (
    <Box className="page-container">
      <Box className="banner-container">
        <Banner />
      </Box>
      <Box className="login-container">
        <Box className="img-container">
          <img
            src="/assets/box_tracking.jpg"
            alt="Box King"
            className="login-img"
          />
        </Box>
        <Box className="custom-form-container">
          <CustomForm
            fields={fields}
            header={header}
            buttonText={buttonText}
            errors={errors}
            login={login}
          ></CustomForm>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
