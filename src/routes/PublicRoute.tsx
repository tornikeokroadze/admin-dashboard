import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from '../redux/store';
import { ReactElement } from 'react';

interface Props {
  children: ReactElement;
}

const PublicRoute = ({ children }: Props) => {
  const token = useSelector((state: RootState) => state.auth.token);

  return token ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
