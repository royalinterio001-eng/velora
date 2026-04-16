import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Copy, Crown, Sparkles, Star, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const UPI_STRING =
  "upi://pay?pa=velora@upi&pn=Velora+Premium&am=99&cu=INR&tn=VeloraPremium";
const UPI_ID = "velora@upi";

const PREMIUM_BENEFITS = [
  { icon: Zap, label: "Unlimited Daily Likes", detail: "No more running out" },
  { icon: Star, label: "5 Super Likes / Day", detail: "Stand out instantly" },
  {
    icon: Crown,
    label: "Verified Gold Badge",
    detail: "Priority in discovery",
  },
  { icon: Sparkles, label: "See Who Liked You", detail: "Match faster" },
];

interface UpiPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (paymentRef: string) => void;
}

export default function UpiPaymentModal({
  open,
  onOpenChange,
  onConfirm,
}: UpiPaymentModalProps) {
  const [step, setStep] = useState<"payment" | "success">("payment");

  const handleConfirm = () => {
    const paymentRef = `VELORA-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setStep("success");
    setTimeout(() => {
      onConfirm(paymentRef);
    }, 1800);
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setTimeout(() => setStep("payment"), 300);
    }
    onOpenChange(open);
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(UPI_ID).catch(() => null);
    toast.success("UPI ID copied!", { duration: 2000 });
  };

  const openUpiApp = () => {
    window.location.href = UPI_STRING;
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        data-ocid="upi-payment-dialog"
        className="max-w-sm w-[calc(100vw-2rem)] rounded-3xl border-0 p-0 overflow-hidden"
        style={{
          background: "oklch(0.16 0 0)",
          boxShadow:
            "0 25px 60px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.68 0.2 50 / 0.2)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {step === "payment" ? (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {/* Header gradient band */}
              <div
                className="relative px-6 pt-8 pb-5 text-center"
                style={{
                  background:
                    "linear-gradient(160deg, oklch(0.18 0.04 50) 0%, oklch(0.16 0 0) 100%)",
                }}
              >
                <div className="mx-auto mb-3 w-14 h-14 rounded-2xl gradient-gold flex items-center justify-center shadow-gold">
                  <Crown size={26} className="text-[oklch(0.13_0_0)]" />
                </div>
                <DialogHeader>
                  <DialogTitle className="font-display text-xl font-bold text-foreground">
                    Velora <span className="text-gradient-gold">Premium</span>
                  </DialogTitle>
                </DialogHeader>
                <p className="mt-1 text-sm text-muted-foreground font-body">
                  Unlock the full luxury experience
                </p>
                {/* Price pill */}
                <div className="mt-4 inline-flex items-baseline gap-1 px-4 py-2 rounded-full border border-[oklch(0.68_0.2_50/0.35)] gradient-gold-subtle">
                  <span className="font-display text-3xl font-bold text-[oklch(0.72_0.22_52)]">
                    ₹99
                  </span>
                  <span className="text-sm text-muted-foreground">/month</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="px-5 pb-4">
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {PREMIUM_BENEFITS.map(({ icon: Icon, label, detail }) => (
                    <div
                      key={label}
                      className="flex flex-col gap-1 p-3 rounded-xl border border-[oklch(0.68_0.2_50/0.15)] gradient-gold-subtle"
                    >
                      <Icon size={15} className="text-primary" />
                      <p className="text-xs font-semibold text-foreground leading-tight">
                        {label}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {detail}
                      </p>
                    </div>
                  ))}
                </div>

                {/* QR Code */}
                <div
                  className="rounded-2xl overflow-hidden border border-[oklch(0.68_0.2_50/0.25)] mb-4"
                  style={{ background: "oklch(0.14 0 0)" }}
                >
                  <div className="py-2 text-center border-b border-[oklch(0.68_0.2_50/0.15)]">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
                      Scan &amp; Pay
                    </p>
                  </div>
                  <div className="flex justify-center py-3 px-4">
                    <img
                      src="/assets/generated/upi-qr-velora.dim_400x480.png"
                      alt="UPI QR Code for velora@upi"
                      className="w-40 h-auto rounded-xl"
                    />
                  </div>
                  {/* UPI ID row */}
                  <button
                    type="button"
                    data-ocid="upi-copy-id"
                    onClick={copyUpiId}
                    className="w-full flex items-center justify-between px-4 py-3 border-t border-[oklch(0.68_0.2_50/0.15)] hover:bg-[oklch(0.68_0.2_50/0.05)] transition-smooth"
                  >
                    <div className="text-left">
                      <p className="text-[10px] text-muted-foreground">
                        UPI ID
                      </p>
                      <p className="text-sm font-semibold text-[oklch(0.72_0.22_52)] font-mono">
                        {UPI_ID}
                      </p>
                    </div>
                    <Copy
                      size={14}
                      className="text-primary flex-shrink-0 ml-2"
                    />
                  </button>
                </div>

                {/* Open UPI app button */}
                <button
                  type="button"
                  data-ocid="upi-open-app-button"
                  onClick={openUpiApp}
                  className="w-full py-2.5 rounded-xl border border-[oklch(0.68_0.2_50/0.3)] text-primary text-sm font-body font-semibold hover:bg-[oklch(0.68_0.2_50/0.08)] transition-smooth mb-3"
                >
                  Open UPI App
                </button>

                {/* I have paid */}
                <button
                  type="button"
                  data-ocid="upi-confirm-button"
                  onClick={handleConfirm}
                  className="w-full py-3.5 rounded-xl gradient-gold text-[oklch(0.13_0_0)] text-sm font-bold font-body shadow-gold transition-smooth hover:opacity-90 active:scale-[0.98]"
                >
                  I Have Paid ✓
                </button>

                <p className="mt-3 text-center text-[10px] text-muted-foreground leading-relaxed">
                  Honor-based payment. Your Premium activates instantly after
                  confirmation. For support, contact{" "}
                  <a
                    href="https://caffeine.ai/support"
                    className="text-primary/70 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    caffeine.ai/support
                  </a>
                  .
                </p>

                {/* Cancel */}
                <button
                  type="button"
                  data-ocid="upi-cancel-button"
                  onClick={() => handleOpenChange(false)}
                  className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-foreground transition-smooth"
                >
                  Maybe later
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center px-8 py-16 text-center gap-5"
            >
              <motion.div
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.1,
                }}
                className="w-20 h-20 rounded-full gradient-gold flex items-center justify-center shadow-gold"
              >
                <CheckCircle
                  size={38}
                  strokeWidth={2}
                  className="text-[oklch(0.13_0_0)]"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                  Welcome to{" "}
                  <span className="text-gradient-gold">Premium!</span>
                </h2>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Your Premium membership is being activated. Enjoy unlimited
                  likes, super likes, and your verified gold badge.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full gradient-gold-subtle border border-[oklch(0.68_0.2_50/0.3)]"
              >
                {(["s1", "s2", "s3", "s4", "s5"] as const).map((id, i) => (
                  <motion.span
                    key={id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.55 + i * 0.08 }}
                  >
                    <Star size={13} className="text-primary fill-primary" />
                  </motion.span>
                ))}
                <span className="text-xs text-primary font-semibold ml-1">
                  Premium Member
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
