import logo from "../../assets/marketing/logo.png";
import adminHero from "../../assets/auth/admin-hero.jpg";
import { useScopedTheme } from "../../app/theme/ScopedThemeProvider";

type AdminAuthLayoutProps = {
  children: React.ReactNode;
};

export default function AdminAuthLayout({
  children,
}: AdminAuthLayoutProps) {
  const { theme } = useScopedTheme();
  
  return (
    <div className={`relative min-h-screen overflow-hidden ${theme === 'dark' ? 'bg-[#1e2834]' : 'bg-slate-50'}`}>
      {/* Hero */}
      <div className="relative h-[320px] overflow-hidden sm:h-[360px]">
        <img
          src={adminHero}
          alt="Soltelco admin"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0 bg-gradient-to-b from-primary/70 to-primary/80"
        />

        {/* Reduced soft glow for both modes */}
        <div 
          className="absolute inset-0" 
          style={{
            background: "radial-gradient(ellipse_at_top,rgba(186,86,212,0.15),transparent_60%)"
          }}
        />

        {/* Enhanced attractive wave design with more layers */}
        <svg
          className="absolute bottom-[-1px] left-0 w-full h-[200px] sm:h-[220px] lg:h-[240px]"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="waveGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 0.85}} />
              <stop offset="30%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 0.9}} />
              <stop offset="70%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 0.95}} />
              <stop offset="100%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 1}} />
            </linearGradient>
            <linearGradient id="waveGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: theme === 'dark' ? '#101922' : '#f1f5f9', stopOpacity: 0.5}} />
              <stop offset="50%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 0.6}} />
              <stop offset="100%" style={{stopColor: theme === 'dark' ? '#101922' : '#ffffff', stopOpacity: 0.7}} />
            </linearGradient>
            <linearGradient id="waveGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: theme === 'dark' ? '#101922' : '#e2e8f0', stopOpacity: 0.25}} />
              <stop offset="100%" style={{stopColor: theme === 'dark' ? '#101922' : '#f8fafc', stopOpacity: 0.35}} />
            </linearGradient>
            <linearGradient id="waveGradient4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor: theme === 'dark' ? '#101922' : '#cbd5e1', stopOpacity: 0.15}} />
              <stop offset="100%" style={{stopColor: theme === 'dark' ? '#101922' : '#e2e8f0', stopOpacity: 0.2}} />
            </linearGradient>
          </defs>
          
          {/* Far background wave layer */}
          <path
            d="M0,180 C96,165 192,150 288,155 C384,160 480,175 576,180 C672,185 768,175 864,165 C960,155 1056,160 1152,170 C1248,180 1344,175 1440,185 L1440,280 L0,280 Z"
            fill="url(#waveGradient4)"
          />
          
          {/* Background wave layer */}
          <path
            d="M0,160 C120,140 240,120 360,130 C480,140 600,160 720,165 C840,170 960,155 1080,145 C1200,135 1320,150 1440,160 L1440,280 L0,280 Z"
            fill="url(#waveGradient3)"
          />
          
          {/* Middle wave layer */}
          <path
            d="M0,140 C180,110 360,90 540,105 C720,120 900,145 1080,135 C1260,125 1350,140 1440,145 L1440,280 L0,280 Z"
            fill="url(#waveGradient2)"
          />
          
          {/* Front wave layer with more wave cycles */}
          <path
            d="M0,120 Q90,85 180,95 T360,105 Q450,90 540,100 T720,110 Q810,95 900,105 T1080,115 Q1170,100 1260,110 T1440,120 L1440,280 L0,280 Z"
            fill="url(#waveGradient1)"
          />
          
          {/* Subtle highlight wave with more cycles */}
          <path
            d="M0,130 C120,100 240,110 360,115 C480,120 600,105 720,115 C840,125 960,110 1080,120 C1200,130 1320,115 1440,125 L1440,280 L0,280 Z"
            fill={theme === 'dark' ? '#475569' : '#ffffff'}
            opacity="0.12"
          />
          
          {/* Additional decorative wave with more cycles */}
          <path
            d="M0,145 Q150,115 300,125 T600,135 Q750,120 900,130 T1200,140 Q1320,135 1440,145 L1440,280 L0,280 Z"
            fill={theme === 'dark' ? '#64748b' : '#ffffff'}
            opacity="0.08"
          />
        </svg>

        {/* Hero content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-start px-6 pb-40 pt-8 text-center text-white">
          <div className="space-y-3">
            {/* Enhanced glass droplet logo */}
            <div className="relative mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-white/50 bg-white/20 shadow-[0_20px_50px_rgba(255,255,255,0.25)] backdrop-blur-3xl transition-all duration-300 hover:scale-105">
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/35 to-white/12" />
              <div className="absolute top-4 h-6 w-12 rounded-full bg-white/30 blur-md" />
              <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_10px_rgba(255,255,255,0.3)]" />
              <img
                src={logo}
                alt="Soltelco"
                className="relative h-28 w-28 object-contain drop-shadow-[0_6px_15px_rgba(186,86,212,0.35)]"
              />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl bg-gradient-to-r from-white via-white/95 to-white/80 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(186,86,212,0.3)]">
                Soltelco Admin
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* grid background */}
      <div className={`absolute inset-x-0 bottom-0 top-[300px] ${theme === 'dark' ? 'bg-[#1e2834]' : 'bg-slate-50'} sm:top-[320px]`}>
        <div
          className="h-full w-full opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(to bottom, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* card */}
      <div className="relative z-20 -mt-6 flex justify-center px-4 pb-10 sm:-mt-24 sm:px-6 lg:-mt-28 lg:px-8">
        <div className={`w-full max-w-2xl rounded-[32px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] backdrop-blur sm:p-8 transition-all duration-300 ${
          theme === 'dark' 
            ? 'bg-slate-900/95 border-slate-700 shadow-[0_20px_60px_rgba(0,0,0,0.4)]' 
            : 'bg-white/95 border-white/70 shadow-[0_20px_60px_rgba(15,23,42,0.12)]'
        }`}>
          {children}
        </div>
      </div>
    </div>
  );
}
