import customerLoginImage from "../../assets/auth/costumer login image.png";
import { useScopedTheme } from "../../app/theme/ScopedThemeProvider";

type CustomerAuthLayoutProps = {
  children: React.ReactNode;
};

export default function CustomerAuthLayout({
  children,
}: CustomerAuthLayoutProps) {
  const { theme } = useScopedTheme();
  
  return (
    <div className={`min-h-screen w-full ${theme === 'dark' ? 'bg-[#101922]' : 'bg-white'}`}>
      <div className="min-h-screen w-full lg:flex">
        {/* Left side */}
        <div className="flex w-full items-start justify-center px-6 pt-8 pb-8 sm:px-10 sm:pt-12 lg:w-5/12 lg:px-14 lg:pt-20 xl:px-20">
          <div className="w-full max-w-md">{children}</div>
        </div>

        {/* Right side */}
        <div className="relative hidden lg:block lg:w-7/12">
          <img
            src={customerLoginImage}
            alt="Connectivity"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-slate-950/55" />

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14 text-white">
            <p className="text-4xl font-medium text-fuchsia-300">
              Business Solutions
            </p>

            <h2 className="mt-4 max-w-2xl text-5xl font-bold leading-tight xl:text-6xl">
              Connectivity for the future of your business.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
