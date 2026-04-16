import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  "data-ocid"?: string;
}

const sizeMap = {
  sm: { outer: "w-4 h-4", icon: 8, ring: "ring-1" },
  md: { outer: "w-5 h-5", icon: 10, ring: "ring-1" },
  lg: { outer: "w-6 h-6", icon: 12, ring: "ring-2" },
};

export default function VerifiedBadge({
  size = "md",
  className,
  "data-ocid": dataOcid,
}: VerifiedBadgeProps) {
  const { outer, icon, ring } = sizeMap[size];

  return (
    <span
      aria-label="Verified premium member"
      title="Premium Member"
      data-ocid={dataOcid}
      className={cn(
        "inline-flex items-center justify-center rounded-full flex-shrink-0",
        "bg-[oklch(0.68_0.2_50)]",
        ring,
        "ring-[oklch(0.78_0.24_55/0.55)]",
        "shadow-[0_0_8px_oklch(0.68_0.2_50/0.65),0_0_16px_oklch(0.68_0.2_50/0.25)]",
        outer,
        className,
      )}
    >
      <svg
        width={icon}
        height={icon}
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M2.5 6.5L5 9L9.5 3.5"
          stroke="white"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
