import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

interface WelcomeStepProps {
  onNext: () => void;
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-8 text-center">
      {/* Logo mark */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="mb-8"
      >
        <div className="relative inline-flex items-center justify-center w-24 h-24 rounded-3xl gradient-gold shadow-gold mb-6">
          <Sparkles
            className="w-10 h-10 text-primary-foreground"
            strokeWidth={1.5}
          />
          <div className="absolute inset-0 rounded-3xl gradient-gold opacity-40 blur-xl -z-10 scale-110" />
        </div>

        <h1 className="font-display text-5xl font-bold tracking-tight mb-2">
          <span className="text-foreground">Vel</span>
          <span className="text-gradient-gold">ora</span>
        </h1>
        <div className="w-12 h-0.5 gradient-gold rounded-full mx-auto" />
      </motion.div>

      {/* Tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mb-12 space-y-3"
      >
        <p className="font-display text-2xl font-semibold text-foreground leading-snug">
          Where extraordinary
          <br />
          people connect
        </p>
        <p className="font-body text-muted-foreground text-base max-w-xs leading-relaxed">
          Curated matches for those who seek depth, elegance, and authentic
          connection.
        </p>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.45 }}
        className="w-full max-w-xs space-y-4"
      >
        <Button
          data-ocid="welcome-get-started"
          onClick={onNext}
          className="w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-display font-semibold text-lg shadow-gold border-0 action-btn"
        >
          Get Started
        </Button>
        <p className="text-xs text-muted-foreground/60 font-body">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </motion.div>

      {/* Decorative orbs */}
      <div className="fixed top-16 right-8 w-32 h-32 rounded-full gradient-gold opacity-[0.07] blur-3xl pointer-events-none" />
      <div className="fixed bottom-32 left-4 w-48 h-48 rounded-full gradient-gold opacity-[0.05] blur-3xl pointer-events-none" />
    </div>
  );
}
