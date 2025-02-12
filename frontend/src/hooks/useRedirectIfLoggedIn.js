import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const useRedirectIfLoggedIn = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [checkingIfLoggedIn, setCheckingIfLoggedIn] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    } else {
      setCheckingIfLoggedIn(false);
    }
  }, [user, navigate, setCheckingIfLoggedIn]);

  return { checkingIfLoggedIn };
};

export default useRedirectIfLoggedIn;
