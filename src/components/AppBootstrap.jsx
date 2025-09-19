import { useRestoreAuth } from '../hooks/useRestoreAuth';

export default function AppBootstrap({ children }) {
  useRestoreAuth();      
  return children || null;
}