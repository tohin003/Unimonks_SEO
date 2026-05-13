type StatusBannerProps = {
  variant: "success" | "error" | "info" | "warning";
  message: string;
};

const styles: Record<StatusBannerProps["variant"], string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  error: "border-rose-200 bg-rose-50 text-rose-800",
  info: "border-slate-200 bg-slate-50 text-slate-700",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export function StatusBanner({ variant, message }: StatusBannerProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={`rounded-2xl border px-4 py-3 text-sm leading-7 ${styles[variant]}`}
    >
      {message}
    </p>
  );
}
