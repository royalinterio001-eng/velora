import AppShell from "@/components/AppShell";
import ConversationItem from "@/components/matches/ConversationItem";
import MatchAvatar from "@/components/matches/MatchAvatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMatches } from "@/hooks/useBackend";
import { Link } from "@tanstack/react-router";
import { Heart, MessageCircle } from "lucide-react";
import { motion } from "motion/react";

function MatchesLoadingSkeleton() {
  return (
    <div>
      <div className="px-5 pt-5 pb-3">
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-2 flex-shrink-0"
            >
              <Skeleton className="w-[68px] h-[68px] rounded-full bg-muted/40" />
              <Skeleton className="h-2.5 w-12 rounded-full bg-muted/30" />
            </div>
          ))}
        </div>
      </div>
      <div className="mt-2">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 px-5 py-3.5 border-b border-border/30"
          >
            <Skeleton className="w-[54px] h-[54px] rounded-full bg-muted/40 flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-3.5 w-32 rounded-full bg-muted/40" />
              <Skeleton className="h-3 w-48 rounded-full bg-muted/30" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyMatchesState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      data-ocid="empty-matches"
      className="flex flex-col items-center justify-center gap-6 text-center px-8 py-20"
    >
      {/* Illustration */}
      <div className="relative">
        <motion.div
          animate={{ scale: [1, 1.05, 1], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          className="absolute inset-0 rounded-full gradient-gold opacity-20 blur-xl"
        />
        <div className="relative w-28 h-28 rounded-full gradient-gold-subtle border border-primary/25 flex items-center justify-center">
          <Heart
            size={44}
            className="text-primary"
            style={{ filter: "drop-shadow(0 0 12px oklch(0.68 0.2 50 / 0.5))" }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="font-display text-2xl font-bold text-foreground">
          No matches yet
        </h2>
        <p className="text-muted-foreground font-body leading-relaxed max-w-[260px] text-sm">
          Start swiping to find your match — your perfect connection is waiting
        </p>
      </div>

      <Link
        to="/discover"
        data-ocid="empty-matches-cta"
        className="px-8 py-3 rounded-2xl gradient-gold text-background font-display font-semibold text-sm shadow-gold action-btn"
      >
        Start Swiping
      </Link>
    </motion.div>
  );
}

export default function MatchesPage() {
  const { data: matches = [], isLoading } = useMatches();
  const newMatches = matches.filter((m) => m.isNew);
  const conversations = matches.filter((m) => !m.isNew || m.lastMessage);

  return (
    <AppShell>
      <div className="min-h-[calc(100vh-128px)]">
        {/* Page header */}
        <div className="px-5 pt-5 pb-3 border-b border-border/30">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-2xl font-bold">
              <span
                className="text-gradient-gold"
                style={{ WebkitTextFillColor: undefined }}
              >
                Matches
              </span>
            </h1>
            {!isLoading && matches.length > 0 && (
              <span className="text-xs text-muted-foreground bg-muted/40 px-2.5 py-1 rounded-full font-mono">
                {matches.length} connection{matches.length !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">
            Your curated connections
          </p>
        </div>

        {isLoading ? (
          <MatchesLoadingSkeleton />
        ) : matches.length === 0 ? (
          <EmptyMatchesState />
        ) : (
          <>
            {/* New Matches — horizontal scroll row */}
            {newMatches.length > 0 && (
              <div className="px-5 pt-5 pb-2">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-[11px] font-bold text-primary uppercase tracking-[0.12em]">
                    New Matches
                  </span>
                  <span className="flex-1 h-px bg-gradient-to-r from-primary/30 to-transparent" />
                  <span className="text-[10px] text-muted-foreground font-mono">
                    {newMatches.length} new
                  </span>
                </div>
                <div
                  data-ocid="new-matches-row"
                  className="flex gap-4 overflow-x-auto pb-3 scrollbar-none"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  {newMatches.map((match, i) => (
                    <motion.div
                      key={match.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.35,
                        delay: i * 0.08,
                        type: "spring",
                      }}
                    >
                      <MatchAvatar match={match} size="lg" />
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Conversations list */}
            {conversations.length > 0 ? (
              <div>
                <div className="flex items-center gap-2 px-5 pt-4 pb-3">
                  <MessageCircle size={12} className="text-muted-foreground" />
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em]">
                    Messages
                  </span>
                  <span className="flex-1 h-px bg-border/40" />
                </div>
                <div data-ocid="conversations-list">
                  {conversations.map((match, i) => (
                    <ConversationItem key={match.id} match={match} index={i} />
                  ))}
                </div>
              </div>
            ) : newMatches.length > 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-muted-foreground font-body italic">
                  No messages yet — break the ice! 💬
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
