import "./Landing.css";
import { Box, Typography } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Landing = () => {
  return (
    <Box className="page-container">
      <Box className="landing-container">
        <Box className="landing-header">
          <Typography className="title" component="div">
            Box King
            <DotLottieReact
              src="https://lottie.host/e6b534b8-dce0-43f0-bdf1-fc5095bcb43e/490sjkroXS.lottie"
              loop
              autoplay
              className="crown-animation"
            />
          </Typography>
          <Typography className="subtitle">
            Your Go-to for Organizing Your Boxes!
          </Typography>
        </Box>
        <Box className="workflow-container">
          <Box className="workflow-steps">
            <Box className="workflow-step">
              <Typography className="workflow-step-title">
                Create A Box
              </Typography>
              <DotLottieReact
                src="https://lottie.host/b12c8f4b-ac60-4c3f-b582-427d2839d6f1/LsEB4YPPd2.lottie"
                loop
                autoplay
                className="workflow-step-animation"
              />
            </Box>
            <Box className="workflow-step">
              <Typography className="workflow-step-title">Add Items</Typography>
              <DotLottieReact
                src="https://lottie.host/f341e8a3-e7c8-4d61-9fef-57077ea92746/XPgk9yQuZR.lottie"
                loop
                autoplay
                className="workflow-step-animation"
              />
            </Box>
            <Box className="workflow-step">
              <Typography className="workflow-step-title">
                Generate QR Code
              </Typography>
              <DotLottieReact
                src="https://lottie.host/a99816cc-4a5d-4011-8445-fe340a5cd641/OBLnyk4xZo.lottie"
                loop
                autoplay
                className="workflow-step-animation"
              />
            </Box>
            <Box className="workflow-step">
              <Typography className="workflow-step-title">Repeat</Typography>
              <DotLottieReact
                src="https://lottie.host/39190afe-dfed-4add-8f93-95cbbb4db035/gDcYHxAxnh.lottie"
                loop
                autoplay
                className="workflow-step-animation"
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Landing;
