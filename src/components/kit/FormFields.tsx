import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  theme?: "dark" | "light";
}

export function FormInput({ label, theme = "dark", className, ...props }: FormInputProps) {
  const isDark = theme === "dark";
  return (
    <div className="space-y-2">
      <label className={cn("block text-sm font-medium", isDark ? "text-white/70" : "text-dark-base/70")}>
        {label}
      </label>
      <input
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none",
          isDark
            ? "bg-dark-overlay border border-white/[0.06] text-white placeholder:text-white/30 focus:border-seed-600/50 focus:shadow-glowSeed"
            : "bg-light-base border border-black/[0.08] text-dark-base placeholder:text-dark-base/30 focus:border-seed-600/50",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  theme?: "dark" | "light";
}

export function FormTextarea({ label, theme = "dark", className, ...props }: FormTextareaProps) {
  const isDark = theme === "dark";
  return (
    <div className="space-y-2">
      <label className={cn("block text-sm font-medium", isDark ? "text-white/70" : "text-dark-base/70")}>
        {label}
      </label>
      <textarea
        rows={4}
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none resize-none",
          isDark
            ? "bg-dark-overlay border border-white/[0.06] text-white placeholder:text-white/30 focus:border-seed-600/50 focus:shadow-glowSeed"
            : "bg-light-base border border-black/[0.08] text-dark-base placeholder:text-dark-base/30 focus:border-seed-600/50",
          className
        )}
        {...props}
      />
    </div>
  );
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: { value: string; label: string }[];
  theme?: "dark" | "light";
}

export function FormSelect({ label, options, theme = "dark", className, ...props }: FormSelectProps) {
  const isDark = theme === "dark";
  return (
    <div className="space-y-2">
      <label className={cn("block text-sm font-medium", isDark ? "text-white/70" : "text-dark-base/70")}>
        {label}
      </label>
      <select
        className={cn(
          "w-full px-4 py-3 rounded-xl text-sm transition-all outline-none appearance-none",
          isDark
            ? "bg-dark-overlay border border-white/[0.06] text-white focus:border-seed-600/50 focus:shadow-glowSeed"
            : "bg-light-base border border-black/[0.08] text-dark-base focus:border-seed-600/50",
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
