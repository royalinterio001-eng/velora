import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface MatchAvatarProps {
  match: Match;
  size?: "md" | "lg";
}

export default function MatchAvatar({ match, size = "lg" }: MatchAvatarProps) {
  const user = match.matchedUser;
  const isLg = size === "lg";

  return (
    <Link
      to="/matches/$matchId"
      params={{ matchId: match.id }}
      data-ocid={`new-match-avatar-${match.id}`}
      className="flex flex-col items-center gap-2 flex-shrink-0 group"
    >
      <div className="relative">
        {/* Gold ring with shimmer for new matches */}
        {match.isNew && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              isLg ? "-inset-1" : "-inset-0.5",
            )}
            style={{
              background:
                "conic-gradient(from 0deg, oklch(0.72 0.22 52), oklch(0.68 0.2 50), oklch(0.78 0.24 55), oklch(0.65 0.2 48), oklch(0.72 0.22 52))",
            }}
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        )}

        {/* Static gold ring for non-new */}
        {!match.isNew && (
          <div
            className={cn(
              "absolute rounded-full border-2",
              isLg ? "-inset-1" : "-inset-0.5",
              "border-border",
            )}
          />
        )}

        {/* Pulse glow for new */}
        {match.isNew && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full",
              isLg ? "-inset-2" : "-inset-1",
            )}
            style={{
              background: "oklch(0.68 0.2 50 / 0.25)",
            }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
            transition={{
              duration: 2.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        )}

        <Avatar
          className={cn(
            "relative border-2 transition-smooth group-hover:scale-105",
            isLg ? "w-[68px] h-[68px]" : "w-14 h-14",
            match.isNew ? "border-background" : "border-border",
          )}
        >
          <AvatarImage
            src={user.photos[0]}
            alt={user.name}
            className="object-cover"
          />
          <AvatarFallback className="bg-card text-foreground font-display font-bold text-lg">
            {user.name[0]}
          </AvatarFallback>
        </Avatar>

        {/* Super Like badge */}
        {match.isNew && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.3 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-gold border-2 border-background flex items-center justify-center shadow-gold"
          >
            <Star size={8} className="text-background fill-background" />
          </motion.div>
        )}
      </div>

      <span
        className={cn(
          "font-body truncate text-center leading-tight",
          isLg ? "text-[11px] max-w-[72px]" : "text-[10px] max-w-[56px]",
          match.isNew ? "text-primary font-semibold" : "text-muted-foreground",
        )}
      >
        {user.name}
      </span>
    </Link>
  );
}
