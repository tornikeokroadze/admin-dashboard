import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { ReactElement } from 'react';

interface Props {
  children: ReactElement;
}

const ProtectedRoute = ({ children }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
