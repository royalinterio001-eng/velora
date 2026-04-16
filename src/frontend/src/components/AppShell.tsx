import { usePremiumStatus } from "@/hooks/useBackend";
import { cn } from "@/lib/utils";
import type { PremiumStatus } from "@/types";
import { Link, useRouterState } from "@tanstack/react-router";
import { Crown, MessageCircle, Sparkles, User } from "lucide-react";
import { createContext, useContext } from "react";

// ---------------------------------------------------------------------------
// Premium context — consumers use usePremium() to read isPremium status
// ---------------------------------------------------------------------------
interface PremiumContextValue {
  isPremium: boolean;
  subscriptionStatus: string;
  premiumActivatedAt?: number;
  isLoading: boolean;
}

const PremiumContext = createContext<PremiumContextValue>({
  isPremium: false,
  subscriptionStatus: "free",
  isLoading: false,
});

export function usePremium() {
  return useContext(PremiumContext);
}

// ---------------------------------------------------------------------------
// Shell
// ---------------------------------------------------------------------------
interface AppShellProps {
  children: React.ReactNode;
  showNav?: boolean;
}

const NAV_ITEMS = [
  { to: "/discover", icon: Sparkles, label: "Discover" },
  { to: "/matches", icon: MessageCircle, label: "Matches" },
  { to: "/profile", icon: User, label: "Profile" },
] as const;

function VeloraWordmark({ isPremium }: { isPremium: boolean }) {
  return (
    <span className="font-display text-2xl font-bold tracking-tight flex items-center gap-1.5">
      <span className="text-foreground">Velor</span>
      <span className="text-gradient-gold">a</span>
      {isPremium && (
        <span
          title="Premium member"
          className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full gradient-gold"
        >
          <Crown size={11} className="text-primary-foreground" />
        </span>
      )}
    </span>
  );
}

export default function AppShell({ children, showNav = true }: AppShellProps) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { data: premiumData, isLoading: premiumLoading } = usePremiumStatus();

  const premiumValue: PremiumContextValue = {
    isPremium: premiumData?.isPremium ?? false,
    subscriptionStatus: premiumData?.subscriptionStatus ?? "free",
    premiumActivatedAt: premiumData?.premiumActivatedAt,
    isLoading: premiumLoading,
  };

  return (
    <PremiumContext.Provider value={premiumValue}>
      <div className="flex flex-col min-h-screen bg-background">
        {/* Header */}
        <header
          data-ocid="app-header"
          className="sticky top-0 z-40 flex items-center justify-center h-16 px-6 border-b border-border bg-card/90 backdrop-blur-xl"
        >
          <VeloraWordmark isPremium={premiumValue.isPremium} />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">{children}</main>

        {/* Bottom navigation */}
        {showNav && (
          <nav
            data-ocid="bottom-nav"
            className="sticky bottom-0 z-40 flex items-center justify-around h-16 px-4 border-t border-border bg-card/95 backdrop-blur-xl"
          >
            {NAV_ITEMS.map(({ to, icon: Icon, label }) => {
              const isActive = pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  data-ocid={`nav-${label.toLowerCase()}`}
                  className={cn(
                    "flex flex-col items-center gap-1 px-4 py-1 rounded-xl transition-smooth min-w-[64px]",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2 : 1.5}
                    className={cn(
                      "transition-smooth",
                      isActive &&
                        "drop-shadow-[0_0_6px_oklch(0.68_0.2_50/0.6)]",
                    )}
                  />
                  <span
                    className={cn(
                      "text-[10px] font-medium tracking-wide transition-smooth",
                      isActive
                        ? "text-primary font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {label}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 w-8 h-0.5 rounded-full gradient-gold" />
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </PremiumContext.Provider>
  );
}
