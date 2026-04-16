import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types";
import { useNavigate } from "@tanstack/react-router";
import { Heart, MessageCircle, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface MatchModalProps {
  matchedProfile: UserProfile | null;
  matchId?: string;
  onClose: () => void;
}

export default function MatchModal({
  matchedProfile,
  matchId,
  onClose,
}: MatchModalProps) {
  const navigate = useNavigate();

  const handleSendMessage = () => {
    onClose();
    if (matchId) {
      navigate({ to: "/matches/$matchId", params: { matchId } });
    } else {
      navigate({ to: "/matches" });
    }
  };

  return (
    <AnimatePresence>
      {matchedProfile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
          data-ocid="match-modal"
        >
          {/* Blurred background */}
          <div className="absolute inset-0 bg-[oklch(0.08_0.02_50/0.97)] backdrop-blur-2xl" />

          {/* Particle sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                // biome-ignore lint/suspicious/noArrayIndexKey: decorative sparkles
                key={i}
                className="absolute w-1 h-1 rounded-full bg-primary/60"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.sin(i * 37) * 160,
                  y: Math.cos(i * 37) * 220,
                }}
                transition={{ delay: 0.3 + i * 0.08, duration: 1.2 }}
                style={{
                  left: "50%",
                  top: "40%",
                }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-sm w-full">
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute -top-14 right-0 w-10 h-10 rounded-xl bg-card/60 backdrop-blur-sm border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close match"
            >
              <X size={18} />
            </button>

            {/* Heart burst */}
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.15,
              }}
              className="mb-8"
            >
              <div className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold">
                <Heart
                  size={34}
                  fill="currentColor"
                  className="text-primary-foreground"
                  strokeWidth={0}
                />
              </div>
            </motion.div>

            {/* Match title */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <h1 className="font-display text-5xl font-black text-gradient-gold mb-2 leading-none">
                It's a Match!
              </h1>
              <p className="text-muted-foreground font-body text-base mt-3">
                You and{" "}
                <span className="text-foreground font-semibold">
                  {matchedProfile.name}
                </span>{" "}
                liked each other
              </p>
            </motion.div>

            {/* Profile photo */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: 0.35,
              }}
              className="my-8"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-gold">
                  <img
                    src={matchedProfile.photos[0]}
                    alt={matchedProfile.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Glow ring */}
                <div className="absolute inset-0 rounded-full shadow-gold pointer-events-none" />
              </div>
              <p className="font-display text-xl font-bold text-foreground mt-3">
                {matchedProfile.name}, {matchedProfile.age}
              </p>
              <p className="text-sm text-muted-foreground">
                {matchedProfile.location}
              </p>
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col gap-3 w-full"
            >
              <Button
                data-ocid="match-send-message"
                onClick={handleSendMessage}
                className="w-full h-14 gradient-gold border-transparent text-primary-foreground font-display font-bold text-base shadow-gold hover:opacity-90"
              >
                <MessageCircle size={18} className="mr-2" />
                Send a Message
              </Button>
              <Button
                data-ocid="match-keep-swiping"
                variant="ghost"
                onClick={onClose}
                className="w-full h-12 text-muted-foreground hover:text-foreground font-body"
              >
                Keep Swiping
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
