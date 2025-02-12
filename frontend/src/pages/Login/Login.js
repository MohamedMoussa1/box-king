import "./Login.css";
import { Box } from "@mui/material";
import useRedirectIfLoggedIn from "../../hooks/useRedirectIfLoggedIn";
import CustomForm from "../../components/CustomForm/CustomForm";

const Login = () => {
  const { checkingIfLoggedIn } = useRedirectIfLoggedIn();
  const fields = [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
  ];

  const header = "Login";
  const buttonText = "Login";
  const errors = ["invalidCredentials"];
  const login = true;

  if (checkingIfLoggedIn) return null;

  return (
    <Box className="page-container">
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
