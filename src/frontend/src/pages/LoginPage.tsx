import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useNavigate } from "@tanstack/react-router";
import { Shield, Star, Verified } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

const FEATURES = [
  {
    icon: Shield,
    title: "Private & Secure",
    desc: "Decentralized identity — only you control your data",
  },
  {
    icon: Star,
    title: "Premium Matches",
    desc: "Curated profiles vetted for quality and intent",
  },
  {
    icon: Verified,
    title: "Verified Profiles",
    desc: "Gold badges mark authenticated, genuine members",
  },
];

const LOGIN_TIMEOUT_MS = 120_000;

export default function LoginPage() {
  const { login, identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [isAttemptingLogin, setIsAttemptingLogin] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (identity) {
      navigate({ to: "/discover" });
    }
  }, [identity, navigate]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const resetLoading = () => {
    setIsAttemptingLogin(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleLogin = async () => {
    if (isAttemptingLogin) return;
    setIsAttemptingLogin(true);
    timeoutRef.current = setTimeout(() => {
      resetLoading();
    }, LOGIN_TIMEOUT_MS);
    try {
      await login();
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      resetLoading();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/assets/generated/velora-login-bg.dim_1200x900.jpg"
          alt=""
          className="w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      {/* Decorative glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-primary/8 blur-[80px] pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero area */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pt-16 pb-6">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mb-8 relative"
          >
            <div className="w-24 h-24 rounded-3xl gradient-gold flex items-center justify-center shadow-gold">
              <span className="font-display text-4xl font-bold text-primary-foreground">
                V
              </span>
            </div>
            <div className="absolute -inset-3 rounded-3xl gradient-gold opacity-15 blur-xl -z-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-center"
          >
            <h1 className="font-display text-5xl font-bold tracking-tight mb-3">
              <span className="text-gradient-gold">Velora</span>
            </h1>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
              Find Your Perfect Match
            </h2>
            <p className="text-muted-foreground text-base font-body max-w-xs leading-relaxed mx-auto">
              A premium dating experience designed for meaningful connections
            </p>
          </motion.div>

          {/* Feature highlights */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 w-full max-w-sm space-y-3"
          >
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-center gap-4 px-4 py-3 rounded-2xl bg-card/40 border border-border/50 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground font-body leading-tight">
                    {title}
                  </p>
                  <p className="text-xs text-muted-foreground font-body leading-snug mt-0.5">
                    {desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA section */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="px-8 pb-12 space-y-4"
        >
          <Button
            data-ocid="login-btn"
            onClick={handleLogin}
            disabled={isAttemptingLogin}
            className="w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-display font-bold text-lg shadow-gold border-0 hover:opacity-90 transition-smooth"
          >
            {isAttemptingLogin ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                Connecting…
              </span>
            ) : (
              "Begin Your Journey"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground leading-relaxed px-4">
            Powered by Internet Identity — no passwords, no email required.{" "}
            <span className="text-primary/70 underline-offset-2 underline cursor-pointer">
              Learn more
            </span>
          </p>

          <p className="text-center text-[10px] text-muted-foreground/60 leading-relaxed">
            By continuing, you agree to our{" "}
            <span className="text-primary/50 underline-offset-2 underline cursor-pointer">
              Terms of Service
            </span>{" "}
            and{" "}
            <span className="text-primary/50 underline-offset-2 underline cursor-pointer">
              Privacy Policy
            </span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
