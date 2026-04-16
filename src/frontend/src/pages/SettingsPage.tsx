import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  Crown,
  Eye,
  HelpCircle,
  Info,
  Lock,
  LogOut,
  Sliders,
  Sparkles,
  Star,
  Trash2,
  Users,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePremium } from "../components/AppShell";

// ─────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────
interface DiscoveryState {
  minAge: number;
  maxAge: number;
  maxDistance: number;
}

const GENDER_PREF_OPTIONS = ["Women", "Men", "Everyone"] as const;
type GenderPrefOption = (typeof GENDER_PREF_OPTIONS)[number];

const PREMIUM_PERKS = [
  { icon: Zap, label: "Unlimited Likes", sub: "Never run out" },
  { icon: Star, label: "5 Super Likes/Day", sub: "Stand out" },
  { icon: Crown, label: "Gold Verified Badge", sub: "Priority discovery" },
  { icon: Sparkles, label: "See Who Liked You", sub: "Match faster" },
];

// ─────────────────────────────────────────────────────────
// Shared sub-components
// ─────────────────────────────────────────────────────────
function SectionLabel({
  label,
  variant = "gold",
}: { label: string; variant?: "gold" | "muted" | "danger" }) {
  const colors = {
    gold: "text-primary",
    muted: "text-muted-foreground",
    danger: "text-destructive/70",
  };
  return (
    <h2
      className={`px-5 text-xs font-bold uppercase tracking-widest mb-2 ${colors[variant]}`}
    >
      {label}
    </h2>
  );
}

interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  valuePreview?: string;
  toggle?: boolean;
  checked?: boolean;
  onCheckedChange?: (v: boolean) => void;
  onClick?: () => void;
  "data-ocid"?: string;
  variant?: "default" | "danger";
}

function SettingRow({
  icon: Icon,
  label,
  description,
  valuePreview,
  toggle,
  checked,
  onCheckedChange,
  onClick,
  "data-ocid": ocid,
  variant = "default",
}: SettingRowProps) {
  const isDanger = variant === "danger";
  return (
    <button
      type="button"
      data-ocid={ocid}
      onClick={onClick}
      disabled={toggle && !onClick}
      className={`w-full flex items-center justify-between px-5 py-4 hover:bg-muted/10 transition-smooth text-left ${toggle && !onClick ? "cursor-default" : "cursor-pointer"}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
            isDanger
              ? "bg-destructive/10 border border-destructive/20"
              : "gradient-gold-subtle border border-primary/20"
          }`}
        >
          <Icon
            size={16}
            className={isDanger ? "text-destructive" : "text-primary"}
          />
        </div>
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-body ${isDanger ? "text-destructive" : "text-foreground"}`}
          >
            {label}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground truncate">
              {description}
            </p>
          )}
        </div>
      </div>
      {toggle ? (
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          className="data-[state=checked]:bg-primary flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div className="flex items-center gap-2 flex-shrink-0">
          {valuePreview && (
            <span className="text-xs text-muted-foreground">
              {valuePreview}
            </span>
          )}
          <ChevronRight size={16} className="text-muted-foreground" />
        </div>
      )}
    </button>
  );
}

// ─────────────────────────────────────────────────────────
// Premium section sub-components
// ─────────────────────────────────────────────────────────
function PremiumMemberCard() {
  return (
    <div
      data-ocid="premium-member-card"
      className="mx-4 rounded-2xl overflow-hidden border border-[oklch(0.68_0.2_50/0.35)] shadow-gold"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.19 0.04 50) 0%, oklch(0.16 0 0) 100%)",
      }}
    >
      <div className="px-5 py-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl gradient-gold flex items-center justify-center shadow-gold flex-shrink-0">
          <Crown size={22} className="text-[oklch(0.13_0_0)]" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-foreground">
              Premium Member
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full gradient-gold text-[oklch(0.13_0_0)] text-[10px] font-bold tracking-wide">
              <Crown size={9} />
              ACTIVE
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">
            All premium benefits unlocked
          </p>
        </div>
      </div>
      <div className="px-5 pb-4 grid grid-cols-2 gap-2">
        {PREMIUM_PERKS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-xs text-[oklch(0.72_0.22_52)]"
          >
            <Icon size={12} className="flex-shrink-0" />
            <span className="truncate font-body">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface UpgradeCardProps {
  onUpgrade: () => void;
}

function UpgradeCard({ onUpgrade }: UpgradeCardProps) {
  return (
    <div
      data-ocid="premium-upgrade-card"
      className="mx-4 rounded-2xl overflow-hidden bg-card border border-border"
    >
      {/* Top band */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
            <Crown size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-body text-foreground font-semibold">
              Current Plan
            </p>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted text-[10px] text-muted-foreground font-semibold uppercase tracking-wide mt-0.5">
              Free
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl font-bold text-[oklch(0.72_0.22_52)]">
            ₹499
          </p>
          <p className="text-[10px] text-muted-foreground">/month</p>
        </div>
      </div>

      {/* Perks list */}
      <div className="px-5 py-3 grid grid-cols-2 gap-y-2.5 gap-x-4 border-b border-border/50">
        {PREMIUM_PERKS.map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex items-start gap-2">
            <div className="w-6 h-6 rounded-lg gradient-gold-subtle border border-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon size={12} className="text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-foreground leading-tight">
                {label}
              </p>
              <p className="text-[10px] text-muted-foreground">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="px-5 py-4">
        <button
          type="button"
          data-ocid="upgrade-premium-button"
          onClick={onUpgrade}
          className="w-full py-3.5 rounded-xl gradient-gold text-[oklch(0.13_0_0)] font-bold text-sm font-body shadow-gold transition-smooth hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          <Crown size={15} />
          Upgrade to Premium — ₹499/mo
        </button>
        <p className="text-center text-[10px] text-muted-foreground mt-2.5 font-body">
          Pay via UPI • Instant activation • Cancel anytime
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────
export default function SettingsPage() {
  const navigate = useNavigate();
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { isPremium } = usePremium();

  // Discovery prefs
  const [discovery, setDiscovery] = useState<DiscoveryState>({
    minAge: 24,
    maxAge: 38,
    maxDistance: 50,
  });
  const [genderPref, setGenderPref] = useState<GenderPrefOption>("Women");

  // Notification toggles
  const [notifMatches, setNotifMatches] = useState(true);
  const [notifMessages, setNotifMessages] = useState(true);
  const [notifLikes, setNotifLikes] = useState(false);

  // Privacy toggles
  const [showDistance, setShowDistance] = useState(true);
  const [showActive, setShowActive] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success("Signed out successfully");
    navigate({ to: "/login" });
  };

  const handleUpgrade = () => {
    navigate({ to: "/upgrade" });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center h-16 px-4 border-b border-border bg-card/90 backdrop-blur-xl">
        <button
          type="button"
          data-ocid="settings-back"
          onClick={() => navigate({ to: "/profile" })}
          className="text-muted-foreground hover:text-foreground transition-smooth mr-3"
          aria-label="Go back"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-display font-bold text-foreground text-lg">
          Settings
        </h1>
      </header>

      <div className="pb-16">
        {/* ── Premium & Billing ── */}
        <div className="mt-6">
          <SectionLabel label="Premium & Billing" />
          {isPremium ? (
            <PremiumMemberCard />
          ) : (
            <UpgradeCard onUpgrade={handleUpgrade} />
          )}
        </div>

        {/* ── Discovery Preferences ── */}
        <div className="mt-6">
          <SectionLabel label="Discovery Preferences" />
          <div className="mx-4 rounded-2xl bg-card border border-border overflow-hidden">
            {/* Age range */}
            <div className="px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
                  <Sliders size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-body text-foreground">Age Range</p>
                  <p className="text-xs text-muted-foreground">
                    Show me people aged{" "}
                    <span className="text-primary font-semibold">
                      {discovery.minAge}–{discovery.maxAge}
                    </span>
                  </p>
                </div>
              </div>
              <Slider
                data-ocid="age-range-slider"
                value={[discovery.minAge, discovery.maxAge]}
                onValueChange={([min, max]) =>
                  setDiscovery((d) => ({ ...d, minAge: min, maxAge: max }))
                }
                min={18}
                max={65}
                step={1}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/20 [&_[role=slider]]:shadow-gold"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>18</span>
                <span>65</span>
              </div>
            </div>

            {/* Max distance */}
            <div className="px-5 py-4 border-b border-border/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
                  <Info size={16} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-body text-foreground">
                    Max Distance
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Within{" "}
                    <span className="text-primary font-semibold">
                      {discovery.maxDistance} km
                    </span>
                  </p>
                </div>
              </div>
              <Slider
                data-ocid="distance-slider"
                value={[discovery.maxDistance]}
                onValueChange={([v]) =>
                  setDiscovery((d) => ({ ...d, maxDistance: v }))
                }
                min={5}
                max={500}
                step={5}
                className="[&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary/20 [&_[role=slider]]:shadow-gold"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
                <span>5 km</span>
                <span>500 km</span>
              </div>
            </div>

            {/* Gender pref */}
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
                  <Users size={16} className="text-primary" />
                </div>
                <Label className="text-sm font-body text-foreground">
                  Show me
                </Label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {GENDER_PREF_OPTIONS.map((g) => (
                  <button
                    key={g}
                    type="button"
                    data-ocid={`gender-pref-${g.toLowerCase()}`}
                    onClick={() => setGenderPref(g)}
                    className={`py-2.5 rounded-xl text-sm font-body transition-smooth border ${
                      genderPref === g
                        ? "gradient-gold text-primary-foreground border-primary/40 shadow-gold"
                        : "bg-background border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Notifications ── */}
        <div className="mt-6">
          <SectionLabel label="Notifications" />
          <div className="mx-4 rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border/50">
            <SettingRow
              icon={Bell}
              label="New matches"
              description="Alert when someone likes you back"
              toggle
              checked={notifMatches}
              onCheckedChange={setNotifMatches}
              data-ocid="notif-matches"
            />
            <SettingRow
              icon={Bell}
              label="New messages"
              description="Alert on incoming messages"
              toggle
              checked={notifMessages}
              onCheckedChange={setNotifMessages}
              data-ocid="notif-messages"
            />
            <SettingRow
              icon={Bell}
              label="Profile likes"
              description="Alert when someone likes your profile"
              toggle
              checked={notifLikes}
              onCheckedChange={setNotifLikes}
              data-ocid="notif-likes"
            />
          </div>
        </div>

        {/* ── Privacy ── */}
        <div className="mt-6">
          <SectionLabel label="Privacy & Safety" />
          <div className="mx-4 rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border/50">
            <SettingRow
              icon={Eye}
              label="Show my distance"
              description="Let others see how far you are"
              toggle
              checked={showDistance}
              onCheckedChange={setShowDistance}
              data-ocid="privacy-distance"
            />
            <SettingRow
              icon={Eye}
              label="Show active status"
              description="Display when you were last online"
              toggle
              checked={showActive}
              onCheckedChange={setShowActive}
              data-ocid="privacy-status"
            />
            <SettingRow
              icon={Lock}
              label="Blocked users"
              description="Manage blocked accounts"
              data-ocid="privacy-blocked"
            />
          </div>
        </div>

        {/* ── Account ── */}
        <div className="mt-6">
          <SectionLabel label="Account" />
          <div className="mx-4 rounded-2xl bg-card border border-border overflow-hidden divide-y divide-border/50">
            <SettingRow
              icon={HelpCircle}
              label="Help & FAQ"
              data-ocid="support-help"
            />
            <SettingRow
              icon={Info}
              label="About Velora"
              description="Version 1.0.0"
              data-ocid="support-about"
            />
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="mt-6 mx-4">
          <button
            type="button"
            data-ocid="logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-border/80 transition-smooth font-body text-sm"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>

        {/* ── Danger Zone ── */}
        <div className="mt-4">
          <SectionLabel label="Danger Zone" variant="danger" />
          <div className="mx-4 rounded-2xl bg-card border border-destructive/20 overflow-hidden">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button
                  type="button"
                  data-ocid="delete-account"
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-destructive/5 transition-smooth text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
                      <Trash2 size={16} className="text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm font-body text-destructive">
                        Delete Account
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Permanently remove your profile
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-destructive/40" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-card border-border rounded-2xl mx-4">
                <AlertDialogHeader>
                  <AlertDialogTitle className="font-display text-foreground text-xl">
                    Delete your account?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="font-body text-muted-foreground text-sm leading-relaxed">
                    This action is permanent and cannot be undone. Your profile,
                    matches, and conversation history will be erased forever.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel
                    data-ocid="delete-cancel"
                    className="flex-1 rounded-xl bg-card border-border text-foreground hover:bg-muted/20"
                  >
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    data-ocid="delete-confirm"
                    className="flex-1 rounded-xl bg-destructive text-destructive-foreground font-semibold hover:bg-destructive/90 border-0"
                    onClick={() =>
                      toast.error("Account deletion is not available yet")
                    }
                  >
                    Delete Forever
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center px-6">
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
