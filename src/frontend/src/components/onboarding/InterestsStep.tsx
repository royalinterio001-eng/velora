import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "motion/react";

const INTEREST_OPTIONS = [
  { label: "Music", emoji: "🎵" },
  { label: "Travel", emoji: "✈️" },
  { label: "Fitness", emoji: "💪" },
  { label: "Art", emoji: "🎨" },
  { label: "Food & Drink", emoji: "🍷" },
  { label: "Coffee", emoji: "☕" },
  { label: "Yoga", emoji: "🧘" },
  { label: "Reading", emoji: "📚" },
  { label: "Gaming", emoji: "🎮" },
  { label: "Hiking", emoji: "🏔️" },
  { label: "Movies", emoji: "🎬" },
  { label: "Cooking", emoji: "👨‍🍳" },
  { label: "Dancing", emoji: "💃" },
  { label: "Photography", emoji: "📷" },
  { label: "Wine", emoji: "🍾" },
  { label: "Meditation", emoji: "🌿" },
  { label: "Sports", emoji: "⚽" },
  { label: "Fashion", emoji: "👗" },
  { label: "Tech", emoji: "💻" },
  { label: "Pets", emoji: "🐾" },
];

interface InterestsStepProps {
  selected: string[];
  onToggle: (interest: string) => void;
  errors: Record<string, string | undefined>;
}

export default function InterestsStep({
  selected,
  onToggle,
  errors,
}: InterestsStepProps) {
  return (
    <motion.div
      key="interests"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground font-body">
          Select at least 3 interests
        </p>
        <span
          className={cn(
            "text-sm font-display font-semibold tabular-nums transition-smooth",
            selected.length >= 3 ? "text-primary" : "text-muted-foreground",
          )}
        >
          {selected.length} / 6
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {INTEREST_OPTIONS.map(({ label, emoji }, index) => {
          const isSelected = selected.includes(label);
          const isDisabled = !isSelected && selected.length >= 6;
          return (
            <motion.button
              key={label}
              type="button"
              data-ocid={`interest-${label.toLowerCase().replace(/[\s&]/g, "-")}`}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.025, duration: 0.2 }}
              onClick={() => !isDisabled && onToggle(label)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-sm font-body font-medium transition-smooth border",
                isSelected
                  ? "gradient-gold text-primary-foreground border-transparent shadow-gold"
                  : isDisabled
                    ? "bg-card/50 text-muted-foreground/40 border-border/50 cursor-not-allowed"
                    : "bg-card text-foreground border-border hover:border-primary/40 hover:text-primary",
              )}
            >
              <span className="text-base leading-none">{emoji}</span>
              {label}
              {isSelected && <Check size={12} strokeWidth={2.5} />}
            </motion.button>
          );
        })}
      </div>

      {errors.interests && (
        <p className="text-xs font-body text-primary/90 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full gradient-gold inline-block" />
          {errors.interests}
        </p>
      )}
    </motion.div>
  );
}
