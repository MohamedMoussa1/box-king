import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const useRedirectIfLoggedOut = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [checkingIfLoggedOut, setCheckingIfLoggedOut] = useState(true);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!user) {
      localStorage.setItem("intendedRouteAfterLogin", pathname);
      navigate("/login");
    } else {
      setCheckingIfLoggedOut(false);
    }
  }, [user, navigate, pathname, setCheckingIfLoggedOut]);

  return { checkingIfLoggedOut };
};

export default useRedirectIfLoggedOut;
