import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface InterestTagsProps {
  interests: string[];
  className?: string;
  selectable?: boolean;
  selected?: string[];
  onToggle?: (interest: string) => void;
}

export default function InterestTags({
  interests,
  className,
  selectable = false,
  selected = [],
  onToggle,
}: InterestTagsProps) {
  if (!interests.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {interests.map((interest, i) => {
        const isSelected = selected.includes(interest);
        return (
          <motion.button
            key={interest}
            type="button"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, duration: 0.25 }}
            onClick={
              selectable && onToggle ? () => onToggle(interest) : undefined
            }
            disabled={!selectable}
            data-ocid={`interest-tag-${interest.toLowerCase().replace(/\s/g, "-")}`}
            className={cn(
              "inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-body font-medium transition-smooth",
              selectable ? "cursor-pointer" : "cursor-default",
              isSelected || !selectable
                ? "bg-primary/10 border border-primary/40 text-primary shadow-[0_0_10px_oklch(0.68_0.2_50/0.15)]"
                : "bg-card border border-border text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {interest}
          </motion.button>
        );
      })}
    </div>
  );
}
