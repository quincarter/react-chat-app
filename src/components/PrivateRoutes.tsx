import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

export interface IPrivateRoutesProps {}

export const PrivateRoutes = (props: IPrivateRoutesProps) => {
  const { user } = useAuth();
  return <>{user ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
