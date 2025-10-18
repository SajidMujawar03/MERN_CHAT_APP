import { useEffect } from "react";
import { useNavigate } from "react-router";
import useUser from "../store/userStore";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/auth");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
};

export default ProtectedRoute;
