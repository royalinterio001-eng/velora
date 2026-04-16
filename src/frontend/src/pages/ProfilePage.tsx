import AppShell, { usePremium } from "@/components/AppShell";
import VerifiedBadge from "@/components/VerifiedBadge";
import InterestTags from "@/components/profile/InterestTags";
import PhotoGrid from "@/components/profile/PhotoGrid";
import ProfileHero from "@/components/profile/ProfileHero";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCallerUserProfile } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import { Crown, Heart, Settings, Star, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

const MOCK_STATS = [
  { label: "Likes this week", value: "24", icon: Heart, trend: "+8" },
  { label: "Super Likes", value: "3", icon: Star, trend: "+1" },
  { label: "Profile views", value: "107", icon: TrendingUp, trend: "+22" },
];

function calcCompletion(
  profile:
    | {
        name?: string;
        bio?: string;
        age?: number;
        location?: string;
        interests?: string[];
        photos?: string[];
        profilePicUrl?: string;
        coverPicUrl?: string;
      }
    | null
    | undefined,
): number {
  if (!profile) return 0;
  const checks = [
    !!profile.name,
    !!profile.bio,
    !!profile.age,
    !!profile.location,
    (profile.interests?.length ?? 0) > 0,
    (profile.photos?.length ?? 0) > 0,
    (profile.photos?.length ?? 0) >= 3,
    !!profile.profilePicUrl,
    !!profile.coverPicUrl,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function PremiumChip() {
  return (
    <span
      data-ocid="premium-chip"
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gradient-gold text-primary-foreground text-xs font-bold border-0 shadow-gold"
    >
      <Crown size={11} />
      Premium Member
    </span>
  );
}

function UpgradeLink() {
  return (
    <Link
      to="/upgrade"
      data-ocid="upgrade-to-premium-link"
      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-smooth font-body border border-border/60 hover:border-primary/30 rounded-full px-3 py-1"
    >
      <Crown size={11} className="text-primary/60" />
      Upgrade to Premium
    </Link>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading } = useGetCallerUserProfile();
  const { isPremium, isLoading: premiumLoading } = usePremium();

  const completionPercent = calcCompletion(profile);
  const photos = profile?.photos ?? [
    "/assets/generated/velora-hero-profile.dim_900x1200.jpg",
  ];
  const interests = profile?.interests ?? [
    "Fine Dining",
    "Opera",
    "Travel",
    "Jazz",
    "Pilates",
  ];
  const bio =
    profile?.bio ??
    "Passionate about the finer things in life — art, architecture, and authentic connections. Looking for someone who values depth.";

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-128px)] pb-10">
        {/* Hero section with cover + avatar overlay */}
        <ProfileHero
          profile={profile ?? null}
          isLoading={isLoading}
          completionPercent={completionPercent}
        />

        {/* Premium status + badges row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mx-4 mt-1 flex items-center gap-2 flex-wrap"
        >
          {isLoading ? (
            <Skeleton className="h-7 w-32 bg-muted/60 rounded-full" />
          ) : (
            <>
              {isPremium && !premiumLoading && (
                <VerifiedBadge size="md" data-ocid="profile-verified-badge" />
              )}
              {!premiumLoading && (
                <div className="flex items-center">
                  {isPremium ? <PremiumChip /> : <UpgradeLink />}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Completion notice */}
        {!isLoading && completionPercent < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-4 mt-4 px-4 py-3 rounded-2xl gradient-gold-subtle border border-primary/20 flex items-center justify-between gap-3"
          >
            <div>
              <p className="text-xs font-semibold text-primary">
                {100 - completionPercent}% left to complete your profile
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Completed profiles get 3× more matches
              </p>
            </div>
            <Link
              to="/profile/edit"
              className="text-xs font-bold text-primary underline underline-offset-2 hover:text-foreground transition-smooth whitespace-nowrap"
              data-ocid="complete-profile-cta"
            >
              Finish →
            </Link>
          </motion.div>
        )}

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mx-4 mt-4 grid grid-cols-3 rounded-2xl bg-card border border-border overflow-hidden"
          data-ocid="stats-grid"
        >
          {MOCK_STATS.map(({ label, value, icon: Icon, trend }, i) => (
            <div
              key={label}
              className={`flex flex-col items-center py-4 gap-1 ${i < 2 ? "border-r border-border" : ""}`}
            >
              <Icon size={14} className="text-primary mb-0.5" />
              <span className="font-display text-xl font-bold text-gradient-gold leading-none">
                {value}
              </span>
              <span className="text-[10px] text-muted-foreground text-center leading-tight">
                {label}
              </span>
              <span className="text-[10px] text-primary font-semibold">
                {trend}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-card border border-border"
        >
          <h2 className="font-display font-semibold text-foreground text-sm mb-2 uppercase tracking-widest text-xs text-primary">
            About
          </h2>
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-muted/60" />
              <Skeleton className="h-4 w-4/5 bg-muted/60" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground font-body leading-relaxed">
              {bio}
            </p>
          )}
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-card border border-border"
        >
          <h2 className="font-display font-semibold text-xs text-primary uppercase tracking-widest mb-3">
            Interests
          </h2>
          {isLoading ? (
            <div className="flex gap-2 flex-wrap">
              {[80, 96, 72, 110, 64].map((w) => (
                <Skeleton
                  key={w}
                  className="h-7 rounded-full bg-muted/60"
                  style={{ width: w }}
                />
              ))}
            </div>
          ) : (
            <InterestTags interests={interests} />
          )}
        </motion.div>

        {/* Photo grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.34 }}
          className="mx-4 mt-4 p-4 rounded-2xl bg-card border border-border"
        >
          <h2 className="font-display font-semibold text-xs text-primary uppercase tracking-widest mb-3">
            Photos
          </h2>
          <PhotoGrid photos={photos} editable={false} />
        </motion.div>

        {/* Settings link */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mt-4"
        >
          <Link
            to="/settings"
            data-ocid="settings-link"
            className="flex items-center justify-between px-5 py-4 rounded-2xl bg-card border border-border hover:border-primary/30 transition-smooth group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl gradient-gold-subtle border border-primary/20 flex items-center justify-center">
                <Settings size={16} className="text-primary" />
              </div>
              <span className="font-body text-foreground text-sm">
                Settings & Preferences
              </span>
            </div>
            <span className="text-muted-foreground group-hover:text-primary transition-smooth text-lg">
              ›
            </span>
          </Link>
        </motion.div>
      </div>
    </AppShell>
  );
}
