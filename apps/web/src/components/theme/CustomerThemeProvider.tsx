import { Outlet } from "react-router-dom";
import { ScopedThemeProvider } from "../../app/theme/ScopedThemeProvider";

export function CustomerThemeProvider() {
  return (
    <ScopedThemeProvider scope="customer">
      <Outlet />
    </ScopedThemeProvider>
  );
}
