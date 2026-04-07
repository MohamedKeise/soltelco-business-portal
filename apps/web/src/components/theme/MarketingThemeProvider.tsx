import { Outlet } from "react-router-dom";
import { ScopedThemeProvider } from "../../app/theme/ScopedThemeProvider";

export function MarketingThemeProvider() {
  return (
    <ScopedThemeProvider scope="marketing">
      <Outlet />
    </ScopedThemeProvider>
  );
}
