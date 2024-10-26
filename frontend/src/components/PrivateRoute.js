import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated") === true;
  
  console.log("Value of isAuthenticated" + isAuthenticated);

  if (!isAuthenticated) {
    console.log("Hy i am here");
    return <Navigate to="/authentication/sign-in/basic" replace />;
  }

  return children;
};

export default PrivateRoute;
