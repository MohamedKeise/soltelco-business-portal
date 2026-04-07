import { useLocation } from "react-router-dom";

export default function Placeholder() {
  const loc = useLocation();
  return (
    <div>
      <h2>Coming Soon</h2>
      <p>This page is not built yet.</p>
      <p>Route: <b>{loc.pathname}</b></p>
    </div>
  );
}
