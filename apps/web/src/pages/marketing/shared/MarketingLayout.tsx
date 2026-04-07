import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MarketingHeader from "./MarketingHeader";
import MarketingFooter from "./MarketingFooter";

// Ensure header is sticky and not affected by parent transforms
export default function MarketingLayout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <MarketingHeader />
      <main className="flex-1 overflow-x-hidden pt-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <MarketingFooter />
    </div>
  );
}
