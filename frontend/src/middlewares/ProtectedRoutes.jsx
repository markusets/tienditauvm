import { Navigate } from "react-router-dom";
import { useRoleStore } from "@/store/carStore.mjs";


const ProtectedRoute = ({ children, requiredRole }) => {
  const userRole = useRoleStore((state) => state.role);

  if (!userRole) {

    return <Navigate to="/auth" replace />;
  }

  //if (userRole !== requiredRole) {
  // Si el rol no coincide, redirige a una página de "Acceso denegado"
  //return <Navigate to="/access-denied" replace />;
  //}

  // Si el rol es válidSo, renderiza la página
  return children;
};

export default ProtectedRoute;


