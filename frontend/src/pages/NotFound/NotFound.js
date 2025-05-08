import "./NotFound.css";
import { Box } from "@mui/material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const NotFound = () => {
  return (
    <Box className="page-container">
      <Box className="not-found-container">
        <DotLottieReact
          src="https://lottie.host/b09e9795-663d-4efd-b46e-f14f0ed7dee7/RDPhYrA6hp.lottie"
          loop
          autoplay
          className="not-found-animation"
        />
      </Box>
    </Box>
  );
};

export default NotFound;
