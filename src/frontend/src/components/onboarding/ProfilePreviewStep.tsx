import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import type { UploadedPhoto } from "./PhotoUploadStep";

interface ProfilePreviewStepProps {
  name: string;
  age: string;
  bio: string;
  location: string;
  interests: string[];
  photos: UploadedPhoto[];
  onStartDiscovering: () => void;
  isLoading: boolean;
}

export default function ProfilePreviewStep({
  name,
  age,
  bio,
  location,
  interests,
  photos,
  onStartDiscovering,
  isLoading,
}: ProfilePreviewStepProps) {
  const mainPhoto = photos[0];

  return (
    <motion.div
      key="preview"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* Success header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-gold shadow-gold mb-2">
          <CheckCircle2
            className="w-7 h-7 text-primary-foreground"
            strokeWidth={1.5}
          />
        </div>
        <h3 className="font-display text-xl font-bold text-foreground">
          Your profile is ready!
        </h3>
        <p className="text-sm text-muted-foreground font-body">
          Here's how you'll appear to others
        </p>
      </motion.div>

      {/* Profile card preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25, duration: 0.4 }}
        className="relative mx-auto max-w-[260px]"
      >
        <div
          className="card-profile shadow-elevated"
          style={{ aspectRatio: "3/4" }}
        >
          {/* Photo background */}
          {mainPhoto ? (
            <img
              src={mainPhoto.previewUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full gradient-card-bg flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl gradient-gold-subtle border border-primary/20 flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-primary/60" />
                </div>
                <p className="text-muted-foreground text-xs font-body">
                  No photo added
                </p>
              </div>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 gradient-overlay-gold" />

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-xl font-bold text-white">
                  {name || "Your Name"}, {age || "—"}
                </h4>
                <div className="w-4 h-4 rounded-full gradient-gold flex items-center justify-center flex-shrink-0">
                  <CheckCircle2
                    size={10}
                    className="text-primary-foreground"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            {location && (
              <div className="flex items-center gap-1.5 text-white/70">
                <MapPin size={11} />
                <span className="text-xs font-body truncate">{location}</span>
              </div>
            )}

            {bio && (
              <p className="text-white/80 text-xs font-body line-clamp-2 leading-relaxed">
                {bio}
              </p>
            )}

            {/* Interests */}
            {interests.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {interests.slice(0, 3).map((interest) => (
                  <span
                    key={interest}
                    className="px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-sm text-white text-[10px] font-body border border-white/15"
                  >
                    {interest}
                  </span>
                ))}
                {interests.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-body border border-primary/30">
                    +{interests.length - 3}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Button
          data-ocid="start-discovering"
          onClick={onStartDiscovering}
          disabled={isLoading}
          className={cn(
            "w-full h-14 rounded-2xl gradient-gold text-primary-foreground font-display font-semibold text-lg",
            "shadow-gold border-0 action-btn",
          )}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
              Creating your profile…
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Sparkles size={18} />
              Start Discovering
            </span>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
