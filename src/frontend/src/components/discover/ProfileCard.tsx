import VerifiedBadge from "@/components/VerifiedBadge";
import { cn } from "@/lib/utils";
import type { UserProfile } from "@/types";
import { Crown, MapPin, Sparkles } from "lucide-react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { useRef, useState } from "react";

interface ProfileCardProps {
  profile: UserProfile;
  onSwipe: (action: "like" | "pass" | "superlike") => void;
  isTop: boolean;
  stackIndex: number;
}

export default function ProfileCard({
  profile,
  onSwipe,
  isTop,
  stackIndex,
}: ProfileCardProps) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-220, 0, 220], [-22, 0, 22]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, -20], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, -40], [1, 0]);

  const scale = isTop ? 1 : stackIndex === 1 ? 0.94 : 0.88;
  const offsetY = isTop ? 0 : stackIndex === 1 ? 16 : 30;
  const opacity = isTop ? 1 : stackIndex === 1 ? 0.85 : 0.65;

  const handlePhotoTap = (e: React.MouseEvent) => {
    if (isDragging) return;
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const tapX = e.clientX - rect.left;
    if (tapX < rect.width / 2) {
      setPhotoIndex((i) => Math.max(0, i - 1));
    } else {
      setPhotoIndex((i) => Math.min(profile.photos.length - 1, i + 1));
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    const currentX = x.get();
    const currentY = y.get();

    if (currentX > 120) {
      onSwipe("like");
    } else if (currentX < -120) {
      onSwipe("pass");
    } else if (currentY < -140) {
      onSwipe("superlike");
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const photo = profile.photos[photoIndex] ?? profile.photos[0];

  if (!isTop) {
    return (
      <div
        className="card-profile absolute inset-0 w-full bg-card shadow-card"
        style={{
          transform: `scale(${scale}) translateY(${offsetY}px)`,
          opacity,
          zIndex: -stackIndex,
          height: "100%",
        }}
      >
        <div className="absolute inset-0">
          <img
            src={photo}
            alt={profile.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 gradient-overlay-gold" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="card-profile absolute inset-0 w-full swipe-card shadow-elevated cursor-grab active:cursor-grabbing"
      style={{ x, y, rotate }}
      drag
      dragConstraints={{ left: -300, right: 300, top: -300, bottom: 100 }}
      dragElastic={0.7}
      onDragStart={() => {
        setIsDragging(true);
        dragStartX.current = x.get();
        dragStartY.current = y.get();
      }}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.99 }}
    >
      {/* Photo */}
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: tap-to-navigate is supplementary */}
      <div
        className="absolute inset-0"
        onClick={handlePhotoTap}
        role="presentation"
      >
        <img
          src={photo}
          alt={profile.name}
          className="w-full h-full object-cover select-none"
          draggable={false}
        />
        <div className="absolute inset-0 gradient-overlay-gold" />
      </div>

      {/* Photo progress dots */}
      {profile.photos.length > 1 && (
        <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
          {profile.photos.map((_, i) => (
            <button
              type="button"
              // biome-ignore lint/suspicious/noArrayIndexKey: stable photo list
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                setPhotoIndex(i);
              }}
              className={cn(
                "h-[3px] flex-1 rounded-full transition-all duration-300",
                i === photoIndex
                  ? "bg-primary shadow-[0_0_6px_oklch(0.68_0.2_50/0.8)]"
                  : "bg-white/30",
              )}
              aria-label={`Photo ${i + 1}`}
            />
          ))}
        </div>
      )}

      {/* LIKE stamp */}
      <motion.div
        className="absolute top-20 left-6 z-30 pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        <div className="border-[3px] border-primary rounded-xl px-4 py-2 rotate-[-20deg]">
          <span className="font-display text-3xl font-black text-primary tracking-widest uppercase">
            LIKE
          </span>
        </div>
      </motion.div>

      {/* NOPE stamp */}
      <motion.div
        className="absolute top-20 right-6 z-30 pointer-events-none"
        style={{ opacity: nopeOpacity }}
      >
        <div className="border-[3px] border-destructive rounded-xl px-4 py-2 rotate-[20deg]">
          <span className="font-display text-3xl font-black text-destructive tracking-widest uppercase">
            NOPE
          </span>
        </div>
      </motion.div>

      {/* SUPER LIKE stamp */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
        style={{ opacity: superLikeOpacity }}
      >
        <div className="border-[3px] border-primary rounded-xl px-5 py-2">
          <span className="font-display text-3xl font-black text-primary tracking-widest uppercase">
            SUPER
          </span>
        </div>
      </motion.div>

      {/* Verified badge – top-right corner for premium profiles */}
      {profile.isPremium && (
        <div className="absolute top-8 right-4 z-20 flex items-center gap-1.5">
          <VerifiedBadge size="md" />
        </div>
      )}

      {/* isVerified (non-premium) badge */}
      {profile.isVerified && !profile.isPremium && (
        <div className="absolute top-8 right-4 z-20">
          <div className="flex items-center gap-1 bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-full px-2.5 py-1">
            <Sparkles size={10} className="text-primary" />
            <span className="text-[10px] text-primary font-bold tracking-wide">
              Verified
            </span>
          </div>
        </div>
      )}

      {/* Profile info */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
        <div className="flex items-baseline gap-2 mb-1">
          <h2 className="font-display text-[1.75rem] font-bold text-foreground leading-tight">
            {profile.name}
          </h2>
          <span className="font-display text-2xl font-medium text-foreground/80">
            {profile.age}
          </span>
        </div>
        {/* Premium pill */}
        {profile.isPremium && (
          <div className="flex items-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[oklch(0.68_0.2_50/0.18)] border border-[oklch(0.68_0.2_50/0.45)] backdrop-blur-sm">
              <Crown size={9} className="text-[oklch(0.78_0.24_55)]" />
              <span className="text-[10px] font-bold tracking-widest text-[oklch(0.78_0.24_55)] uppercase">
                Premium
              </span>
            </span>
          </div>
        )}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin size={12} className="text-foreground/60 shrink-0" />
          <p className="text-foreground/60 text-sm font-body">
            {profile.occupation && `${profile.occupation} · `}
            {profile.location}
          </p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {profile.interests.slice(0, 3).map((interest) => (
            <span
              key={interest}
              className="text-xs px-3 py-1 rounded-full bg-foreground/10 backdrop-blur-md border border-foreground/20 text-foreground/90 font-body"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
