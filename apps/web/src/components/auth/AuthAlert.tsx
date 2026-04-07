type AuthAlertProps = {
  type: "error" | "success";
  message: string;
  title?: string;
};

export default function AuthAlert({ type, message, title }: AuthAlertProps) {
  const isError = type === "error";

  const defaultTitle = isError ? "Authentication Required" : "Verification Complete";
  const alertTitle = title || defaultTitle;

  return (
    <div
      className={[
        "group relative overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.01]",
        isError
          ? "bg-gradient-to-br from-red-50 via-white to-rose-50 border border-red-200/50"
          : "bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200/50",
      ].join(" ")}
      role="alert"
      aria-live="polite"
    >
      {/* Premium gradient border */}
      <div
        className={[
          "absolute inset-0 rounded-lg bg-gradient-to-br opacity-100",
          isError
            ? "bg-gradient-to-br from-red-200/20 via-transparent to-rose-200/20"
            : "bg-gradient-to-br from-emerald-200/20 via-transparent to-teal-200/20",
        ].join(" ")}
      />

      {/* Premium content */}
      <div className="relative p-3">
        <div className="flex items-start gap-3">
          {/* Sophisticated icon */}
          <div className="relative flex-shrink-0">
            {/* Icon glow background */}
            <div
              className={[
                "absolute inset-0 rounded-lg blur-lg opacity-25",
                isError ? "bg-red-400" : "bg-emerald-400",
              ].join(" ")}
            />
            
            {/* Icon container */}
            <div
              className={[
                "relative flex h-7 w-7 items-center justify-center rounded-lg shadow-md backdrop-blur-sm border transition-all duration-300 group-hover:scale-105",
                isError
                  ? "bg-gradient-to-br from-red-500 to-rose-600 border-red-300/50 text-white"
                  : "bg-gradient-to-br from-emerald-500 to-teal-600 border-emerald-300/50 text-white",
              ].join(" ")}
            >
              {/* Inner shine */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-white/0 to-white/20 opacity-60" />
              
              <span className="relative text-sm font-semibold">
                {isError ? "!" : "✓"}
              </span>
            </div>
          </div>

          {/* Enhanced content */}
          <div className="min-w-0 flex-1">
            <div className="min-w-0">
              <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
                {alertTitle}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-slate-600 font-medium">
                {message}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle top highlight */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
}
