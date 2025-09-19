import { useRestoreAuth } from '../hooks/useRestoreAuth';

export default function AppBootstrap({ children }) {
  useRestoreAuth();      // corre dentro del Provider
  return children || null;
}