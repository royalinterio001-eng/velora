import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Crown,
  Eye,
  Repeat,
  Shield,
  Star,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useActivatePremium } from "../hooks/useBackend";

const UPI_STRING =
  "upi://pay?pa=velora@upi&pn=Velora&am=499&cu=INR&tn=VeloraPremium";
const UPI_ID = "velora@upi";

const PERKS = [
  {
    icon: Repeat,
    label: "Unlimited Super Likes",
    desc: "Express strong interest anytime",
  },
  {
    icon: Eye,
    label: "See Who Liked You",
    desc: "Don't miss a potential match",
  },
  { icon: Zap, label: "Unlimited Matches", desc: "No daily swipe limits" },
  { icon: Star, label: "Priority Discovery", desc: "Your profile shown first" },
  {
    icon: Crown,
    label: "Verified Premium Badge",
    desc: "Gold badge on your profile",
  },
  {
    icon: Shield,
    label: "Ad-free Experience",
    desc: "Distraction-free browsing",
  },
];

export default function UpgradePage() {
  const navigate = useNavigate();
  const activatePremium = useActivatePremium();

  const [paymentRef, setPaymentRef] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID).catch(() => {});
    toast.success("UPI ID copied!");
  };

  const handleOpenUpi = () => {
    window.location.href = UPI_STRING;
  };

  const handleConfirm = () => {
    if (!paymentRef.trim()) {
      toast.error("Please enter your payment reference number");
      return;
    }
    activatePremium.mutate(paymentRef.trim(), {
      onSuccess: (activated) => {
        if (activated) {
          setShowSuccess(true);
          setTimeout(() => {
            navigate({ to: "/discover" });
          }, 2500);
        } else {
          toast.error("Activation pending", {
            description:
              "Payment reference recorded. Contact support if not activated within 24h.",
            duration: 6000,
          });
        }
      },
      onError: () => {
        toast.error(
          "Something went wrong. Please try again or contact support.",
        );
      },
    });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center h-14 px-4 border-b border-border bg-card/90 backdrop-blur-xl">
        <button
          type="button"
          data-ocid="upgrade-back"
          onClick={() => navigate({ to: -1 as never })}
          className="text-muted-foreground hover:text-foreground transition-smooth mr-3"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="font-display font-bold text-foreground text-lg">
          Velora Premium
        </h1>
      </header>

      {/* Success overlay */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            key="success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="w-28 h-28 rounded-3xl gradient-gold flex items-center justify-center shadow-gold mb-6"
            >
              <Crown size={52} className="text-primary-foreground" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="text-center px-8"
            >
              <h2 className="font-display text-3xl font-bold text-gradient-gold mb-3">
                Welcome to Premium!
              </h2>
              <p className="text-muted-foreground font-body">
                All premium benefits are now active. Redirecting you…
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto pb-12">
        {/* Hero band */}
        <div className="relative px-6 pt-8 pb-6 text-center overflow-hidden bg-gradient-to-br from-card to-background">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 rounded-3xl gradient-gold mx-auto flex items-center justify-center shadow-gold mb-4">
              <Crown size={36} className="text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold text-gradient-gold mb-2">
              Unlock the Full Experience
            </h2>
            <p className="text-muted-foreground font-body text-sm leading-relaxed max-w-xs mx-auto">
              Get unlimited access to everything Velora has to offer
            </p>
            <div className="mt-4 inline-flex items-baseline gap-1">
              <span className="font-display text-5xl font-bold text-foreground">
                ₹499
              </span>
              <span className="text-muted-foreground font-body text-sm">
                /month
              </span>
            </div>
          </motion.div>
        </div>

        {/* Benefits grid */}
        <div className="px-4 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 px-1">
            What's Included
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {PERKS.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.4 }}
                className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2"
              >
                <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
                  <Icon size={16} className="text-primary" />
                </div>
                <p className="text-sm font-semibold text-foreground font-body leading-tight">
                  {label}
                </p>
                <p className="text-[11px] text-muted-foreground font-body leading-snug">
                  {desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment section */}
        <div className="px-4 mt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-primary mb-3 px-1">
            Pay via UPI
          </h3>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* QR code */}
            <div className="flex flex-col items-center px-6 py-6 border-b border-border/50">
              <div
                className="w-44 h-44 rounded-2xl flex items-center justify-center bg-foreground p-3 shadow-sm"
                data-ocid="upi-qr-container"
              >
                {/* Static QR visual — actual QR from upi string */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(UPI_STRING)}&bgcolor=ffffff&color=000000&margin=4`}
                  alt="UPI QR Code for Velora Premium payment"
                  className="w-full h-full rounded-xl"
                  onError={(e) => {
                    // Fallback: hide img and show text
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <p className="mt-3 text-sm font-body text-muted-foreground text-center">
                Scan with any UPI app
              </p>
              <p className="text-xs text-muted-foreground/60 font-body">
                GPay • PhonePe • Paytm • BHIM
              </p>
            </div>

            {/* UPI ID + buttons */}
            <div className="px-5 py-4 space-y-3 border-b border-border/50">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-body mb-1">
                    UPI ID
                  </p>
                  <p className="font-mono text-sm text-foreground font-semibold">
                    {UPI_ID}
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="copy-upi-btn"
                  onClick={handleCopyUpi}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-muted border border-border text-xs font-body text-muted-foreground hover:text-foreground transition-smooth flex-shrink-0"
                >
                  <Copy size={13} />
                  Copy
                </button>
              </div>
              <button
                type="button"
                data-ocid="open-upi-btn"
                onClick={handleOpenUpi}
                className="w-full py-3 rounded-xl gradient-gold text-primary-foreground font-bold text-sm font-body shadow-gold transition-smooth hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Zap size={15} />
                Open UPI App — Pay ₹499
              </button>
            </div>

            {/* Confirmation input */}
            <div className="px-5 py-5 space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground font-body mb-1">
                  Confirm your payment
                </p>
                <p className="text-xs text-muted-foreground font-body mb-3">
                  After paying, enter the transaction ID or UTR number below
                </p>
                <Input
                  data-ocid="payment-ref-input"
                  placeholder="e.g. 407823456789"
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  className="bg-background border-input rounded-xl font-mono text-sm h-12"
                />
              </div>
              <Button
                data-ocid="confirm-payment-btn"
                onClick={handleConfirm}
                disabled={activatePremium.isPending || !paymentRef.trim()}
                className="w-full h-13 rounded-xl gradient-gold text-primary-foreground font-bold text-sm font-body shadow-gold border-0 hover:opacity-90 transition-smooth flex items-center gap-2 disabled:opacity-50"
              >
                {activatePremium.isPending ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground animate-spin" />
                    Activating…
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    Confirm Payment &amp; Activate Premium
                  </>
                )}
              </Button>
              <p className="text-center text-[11px] text-muted-foreground font-body">
                Honor-based system • Instant activation upon confirmation
              </p>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="px-4 mt-4">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: Shield, label: "Secure" },
              { icon: Check, label: "Instant" },
              { icon: Crown, label: "Premium" },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-1.5 text-muted-foreground/60"
              >
                <Icon size={13} />
                <span className="text-xs font-body">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center px-6">
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()}. Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary/60 hover:text-primary transition-smooth"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
