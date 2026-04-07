import { Outlet } from "react-router-dom";
import { ScopedThemeProvider } from "../../app/theme/ScopedThemeProvider";

export function AdminThemeProvider() {
  return (
    <ScopedThemeProvider scope="admin">
      <Outlet />
    </ScopedThemeProvider>
  );
}
