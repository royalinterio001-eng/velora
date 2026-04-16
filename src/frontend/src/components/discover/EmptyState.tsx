import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, Star } from "lucide-react";
import { motion } from "motion/react";

interface EmptyStateProps {
  onRefresh?: () => void;
  onAdjustFilters?: () => void;
}

export default function EmptyState({
  onRefresh,
  onAdjustFilters,
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-6 text-center px-8 py-12"
      data-ocid="empty-discover"
    >
      {/* Shimmer illustration */}
      <div className="relative">
        {/* Outer glow ring */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full gradient-gold-subtle"
          style={{ filter: "blur(20px)" }}
        />

        {/* Main icon container */}
        <div className="relative w-28 h-28 rounded-3xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
          <Sparkles size={44} className="text-primary" />

          {/* Decorative floating stars */}
          {[
            { top: "-8px", right: "4px", size: 14, delay: 0 },
            { top: "8px", right: "-10px", size: 10, delay: 0.4 },
            { bottom: "2px", left: "-8px", size: 12, delay: 0.8 },
          ].map((pos, i) => (
            <motion.div
              // biome-ignore lint/suspicious/noArrayIndexKey: decorative stars
              key={i}
              animate={{ y: [-4, 4, -4], opacity: [0.4, 1, 0.4] }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Number.POSITIVE_INFINITY,
                delay: pos.delay,
              }}
              className="absolute"
              style={{
                top: pos.top,
                right: pos.right,
                bottom: pos.bottom,
                left: pos.left,
              }}
            >
              <Star
                size={pos.size}
                className="text-primary"
                fill="currentColor"
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Text */}
      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          You've seen everyone
        </h2>
        <p className="text-muted-foreground font-body leading-relaxed max-w-[240px]">
          You've explored all exclusive profiles in your area. New members join
          daily.
        </p>
      </div>

      {/* Gold divider */}
      <div className="w-16 h-px gradient-gold opacity-40 rounded-full" />

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-[220px]">
        {onRefresh && (
          <Button
            onClick={onRefresh}
            data-ocid="empty-refresh"
            className="w-full gradient-gold border-transparent text-primary-foreground font-semibold shadow-gold hover:opacity-90"
          >
            <RefreshCw size={15} className="mr-2" />
            Check for New Profiles
          </Button>
        )}
        {onAdjustFilters && (
          <Button
            variant="ghost"
            onClick={onAdjustFilters}
            data-ocid="empty-adjust-filters"
            className="w-full text-muted-foreground hover:text-foreground text-sm"
          >
            Adjust Filters
          </Button>
        )}
      </div>
    </motion.div>
  );
}
