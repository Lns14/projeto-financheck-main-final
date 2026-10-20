import { RouterProvider } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { router } from './routes';
import AccessibilityButton from "./components/ui/AccessibilityButton";

export default function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <AccessibilityButton />
    </AuthProvider>
  );
}
