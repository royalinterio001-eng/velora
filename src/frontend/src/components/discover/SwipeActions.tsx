import { cn } from "@/lib/utils";
import { Heart, Sparkles, X } from "lucide-react";
import { motion } from "motion/react";

interface SwipeActionsProps {
  onPass: () => void;
  onSuperLike: () => void;
  onLike: () => void;
  superLikesRemaining: number;
  disabled?: boolean;
}

function ActionButton({
  onClick,
  ariaLabel,
  ocid,
  className,
  children,
  disabled,
}: {
  onClick: () => void;
  ariaLabel: string;
  ocid: string;
  className: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      data-ocid={ocid}
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08, y: -3 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      className={cn(
        "relative flex items-center justify-center rounded-2xl border transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40 disabled:pointer-events-none",
        className,
      )}
    >
      {children}
    </motion.button>
  );
}

export default function SwipeActions({
  onPass,
  onSuperLike,
  onLike,
  superLikesRemaining,
  disabled,
}: SwipeActionsProps) {
  return (
    <div className="flex items-center justify-center gap-5 py-4">
      {/* Pass */}
      <ActionButton
        ocid="action-pass"
        ariaLabel="Pass"
        onClick={onPass}
        disabled={disabled}
        className="w-16 h-16 bg-card/80 backdrop-blur-sm border-border hover:border-destructive/50 hover:bg-destructive/5 shadow-card"
      >
        <X size={26} className="text-muted-foreground" strokeWidth={2.5} />
      </ActionButton>

      {/* Super Like */}
      <ActionButton
        ocid="action-superlike"
        ariaLabel="Super Like"
        onClick={onSuperLike}
        disabled={disabled || superLikesRemaining === 0}
        className="w-14 h-14 bg-primary/10 border-primary/30 hover:bg-primary/20 hover:border-primary/60 hover:shadow-gold"
      >
        <Sparkles size={22} className="text-primary" strokeWidth={2} />
        {superLikesRemaining > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full gradient-gold flex items-center justify-center text-[9px] font-bold text-primary-foreground shadow-gold leading-none">
            {superLikesRemaining}
          </span>
        )}
      </ActionButton>

      {/* Like */}
      <ActionButton
        ocid="action-like"
        ariaLabel="Like"
        onClick={onLike}
        disabled={disabled}
        className="w-16 h-16 gradient-gold border-transparent shadow-gold hover:opacity-90"
      >
        <Heart
          size={26}
          className="text-primary-foreground"
          fill="currentColor"
          strokeWidth={0}
        />
      </ActionButton>
    </div>
  );
}
