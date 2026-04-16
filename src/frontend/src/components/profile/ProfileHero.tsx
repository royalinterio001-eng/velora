import CompletionRing from "@/components/profile/CompletionRing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { UserProfile } from "@/types";
import { Link } from "@tanstack/react-router";
import { Edit3, MapPin, ShieldCheck } from "lucide-react";

interface ProfileHeroProps {
  profile: UserProfile | null;
  isLoading?: boolean;
  completionPercent: number;
}

export default function ProfileHero({
  profile,
  isLoading,
  completionPercent,
}: ProfileHeroProps) {
  const primaryPhoto =
    profile?.photos?.[0] ??
    "/assets/generated/velora-hero-profile.dim_900x1200.jpg";
  const profilePicUrl = profile?.profilePicUrl ?? primaryPhoto;
  const coverPicUrl = profile?.coverPicUrl ?? null;
  const displayName = profile?.name ?? "Your Profile";
  const age = profile?.age;
  const location = profile?.location;

  return (
    <div className="relative w-full">
      {/* Cover photo banner */}
      <div className="relative w-full" style={{ height: 200, minHeight: 160 }}>
        {coverPicUrl ? (
          <img
            src={coverPicUrl}
            alt="Cover"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.18 0.02 50) 0%, oklch(0.22 0.06 50) 40%, oklch(0.28 0.12 50) 100%)",
            }}
          />
        )}
        {/* Overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent 40%, oklch(0.12 0.01 50 / 0.85) 100%)",
          }}
        />

        {/* Edit button — top right */}
        <div className="absolute top-4 right-4 z-20">
          <Link to="/profile/edit" data-ocid="edit-profile-hero-btn">
            <Button
              size="sm"
              className="h-9 px-4 rounded-xl gradient-gold text-primary-foreground font-semibold border-0 shadow-gold action-btn gap-1.5"
            >
              <Edit3 size={13} />
              Edit
            </Button>
          </Link>
        </div>
      </div>

      {/* Avatar overlapping cover at bottom edge */}
      <div className="relative px-5 pb-4">
        <div className="flex items-end gap-4 -mt-14">
          {/* Profile pic ring */}
          <div className="relative flex-shrink-0 z-10">
            {isLoading ? (
              <div className="w-28 h-28 rounded-full bg-card/40 border-4 border-background animate-pulse" />
            ) : (
              <CompletionRing
                percent={completionPercent}
                size={112}
                strokeWidth={4}
              >
                <img
                  src={profilePicUrl}
                  alt={displayName}
                  className="w-24 h-24 rounded-full object-cover border-2 border-primary/50"
                />
              </CompletionRing>
            )}
          </div>

          {/* Name / info to the right of avatar */}
          <div className="flex-1 min-w-0 pb-2 pt-16">
            <div className="flex items-center gap-2 flex-wrap">
              {isLoading ? (
                <div className="h-7 w-40 bg-muted/60 rounded-xl animate-pulse" />
              ) : (
                <h1 className="font-display text-2xl font-bold text-foreground leading-tight truncate">
                  {displayName}
                  {age ? (
                    <span className="text-muted-foreground font-normal ml-1">
                      , {age}
                    </span>
                  ) : null}
                </h1>
              )}
              {profile?.isVerified && !isLoading && (
                <Badge
                  data-ocid="verified-badge"
                  className="flex items-center gap-1 px-2.5 py-0.5 rounded-full gradient-gold text-primary-foreground border-0 text-[11px] font-bold shadow-gold shrink-0"
                >
                  <ShieldCheck size={11} />
                  Verified
                </Badge>
              )}
            </div>
            {location && !isLoading && (
              <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-0.5">
                <MapPin size={12} className="text-primary" />
                <span className="font-body truncate">{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
