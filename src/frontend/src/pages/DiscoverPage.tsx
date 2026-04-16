import AppShell from "@/components/AppShell";
import EmptyState from "@/components/discover/EmptyState";
import FiltersDrawer from "@/components/discover/FiltersDrawer";
import MatchModal from "@/components/discover/MatchModal";
import ProfileCard from "@/components/discover/ProfileCard";
import SwipeActions from "@/components/discover/SwipeActions";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscoveryProfiles, useSwipeAction } from "@/hooks/useBackend";
import type { DiscoveryFilters, UserProfile } from "@/types";
import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";

const DEFAULT_FILTERS: DiscoveryFilters = {
  minAge: 18,
  maxAge: 45,
  maxDistance: 50,
  interests: [],
};

interface MatchState {
  profile: UserProfile;
  matchId?: string;
}

export default function DiscoverPage() {
  const { data: profiles = [], isLoading, refetch } = useDiscoveryProfiles();
  const swipe = useSwipeAction();
  const [matchState, setMatchState] = useState<MatchState | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState<DiscoveryFilters>(DEFAULT_FILTERS);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | "up">(
    "right",
  );
  const actionInProgress = useRef(false);

  const topProfile = profiles[0];
  const secondProfile = profiles[1];
  const thirdProfile = profiles[2];

  // Derive super likes remaining from top profile
  const superLikesRemaining = 5;

  const handleAction = useCallback(
    async (action: "like" | "pass" | "superlike") => {
      if (!topProfile || actionInProgress.current) return;
      actionInProgress.current = true;

      setExitDirection(
        action === "like" ? "right" : action === "superlike" ? "up" : "left",
      );

      try {
        const result = await swipe.mutateAsync({
          targetUserId: topProfile.id,
          action,
        });

        if (result.isMatch) {
          setMatchState({ profile: topProfile });
        } else if (action === "superlike") {
          toast("⭐ Super Like sent!", {
            description: `${topProfile.name} will be notified.`,
          });
        }
      } catch {
        toast.error("Something went wrong. Please try again.");
      } finally {
        actionInProgress.current = false;
      }
    },
    [topProfile, swipe],
  );

  const exitVariants = {
    left: { x: -350, rotate: -25, opacity: 0 },
    right: { x: 350, rotate: 25, opacity: 0 },
    up: { y: -400, opacity: 0, scale: 0.9 },
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100dvh-128px)]">
        {/* Page header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 flex-shrink-0">
          <div>
            <h1 className="font-display text-xl font-bold text-foreground leading-tight">
              Discover
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {profiles.length > 0
                ? `${profiles.length} exclusive profile${profiles.length !== 1 ? "s" : ""} nearby`
                : "Explore new connections"}
            </p>
          </div>
          <motion.button
            type="button"
            data-ocid="filters-btn"
            onClick={() => setFiltersOpen(true)}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-smooth text-sm"
          >
            <SlidersHorizontal size={14} />
            <span className="font-medium">Filters</span>
            {(filters.interests.length > 0 ||
              filters.minAge !== 18 ||
              filters.maxAge !== 45) && (
              <span className="w-2 h-2 rounded-full gradient-gold" />
            )}
          </motion.button>
        </div>

        {/* Card stack area */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 pb-2 min-h-0">
          {isLoading ? (
            <div className="w-full max-w-sm space-y-3">
              <Skeleton
                className="w-full rounded-3xl bg-card/80"
                style={{ height: "460px" }}
              />
              <div className="flex justify-center gap-5 pt-2">
                <Skeleton className="w-16 h-16 rounded-2xl bg-card/80" />
                <Skeleton className="w-14 h-14 rounded-xl bg-card/80" />
                <Skeleton className="w-16 h-16 rounded-2xl bg-card/80" />
              </div>
            </div>
          ) : profiles.length === 0 ? (
            <EmptyState
              onRefresh={() => refetch()}
              onAdjustFilters={() => setFiltersOpen(true)}
            />
          ) : (
            <div className="w-full max-w-sm flex flex-col gap-0">
              {/* Card stack */}
              <div
                className="relative w-full"
                style={{ height: "min(460px, calc(100dvh - 320px))" }}
              >
                {/* Third card (deepest) */}
                {thirdProfile && (
                  <ProfileCard
                    key={`${thirdProfile.id}-d2`}
                    profile={thirdProfile}
                    onSwipe={() => {}}
                    isTop={false}
                    stackIndex={2}
                  />
                )}

                {/* Second card */}
                {secondProfile && (
                  <ProfileCard
                    key={`${secondProfile.id}-d1`}
                    profile={secondProfile}
                    onSwipe={() => {}}
                    isTop={false}
                    stackIndex={1}
                  />
                )}

                {/* Top swipeable card */}
                <AnimatePresence mode="popLayout">
                  {topProfile && (
                    <motion.div
                      key={topProfile.id}
                      className="absolute inset-0"
                      exit={{
                        ...exitVariants[exitDirection],
                        transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
                      }}
                    >
                      <ProfileCard
                        profile={topProfile}
                        onSwipe={handleAction}
                        isTop
                        stackIndex={0}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action buttons */}
              <div className="flex-shrink-0">
                <SwipeActions
                  onPass={() => handleAction("pass")}
                  onSuperLike={() => handleAction("superlike")}
                  onLike={() => handleAction("like")}
                  superLikesRemaining={superLikesRemaining}
                  disabled={!topProfile || swipe.isPending}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Match modal */}
      <MatchModal
        matchedProfile={matchState?.profile ?? null}
        matchId={matchState?.matchId}
        onClose={() => setMatchState(null)}
      />

      {/* Filters drawer */}
      <FiltersDrawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        filters={filters}
        onSave={(newFilters) => {
          setFilters(newFilters);
          toast.success("Filters applied!", {
            description: "Your discovery preferences have been updated.",
          });
        }}
      />
    </AppShell>
  );
}
