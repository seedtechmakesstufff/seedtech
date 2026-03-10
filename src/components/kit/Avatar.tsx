import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-16 h-16 text-lg",
};

export function Avatar({ initials, size = "lg", className }: AvatarProps) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-brand flex items-center justify-center font-display font-bold text-white shrink-0",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
}

/* ── TeamMemberCard ── */
export interface TeamMemberCardProps {
  initials?: string;
  name: string;
  role: string;
  bio: string;
}

export function TeamMemberCard({ initials, name, role, bio }: TeamMemberCardProps) {
  const derivedInitials = initials ?? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="space-y-5">
      <Avatar initials={derivedInitials} size="xl" />
      <div>
        <h3 className="font-display text-subheading text-white">{name}</h3>
        <p className="text-body-sm text-white/50 mt-1">{role}</p>
      </div>
      <p className="text-body-sm text-white/40 leading-relaxed">{bio}</p>
    </div>
  );
}
