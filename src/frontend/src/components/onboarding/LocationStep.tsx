import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MapPin, Ruler } from "lucide-react";
import { motion } from "motion/react";

interface LocationStepProps {
  location: string;
  height: string;
  onChangeLocation: (val: string) => void;
  onChangeHeight: (val: string) => void;
  errors: Record<string, string | undefined>;
}

const HEIGHT_LABELS: Record<number, string> = {
  150: "4'11\"",
  155: "5'1\"",
  160: "5'3\"",
  165: "5'5\"",
  170: "5'7\"",
  175: "5'9\"",
  180: "5'11\"",
  185: "6'1\"",
  190: "6'3\"",
  195: "6'5\"",
};

function cmToFeetLabel(cm: number): string {
  const totalInches = Math.round(cm / 2.54);
  const feet = Math.floor(totalInches / 12);
  const inches = totalInches % 12;
  return `${feet}'${inches}"`;
}

export default function LocationStep({
  location,
  height,
  onChangeLocation,
  onChangeHeight,
  errors,
}: LocationStepProps) {
  const heightNum = Number(height) || 170;
  const heightLabel = HEIGHT_LABELS[heightNum] ?? cmToFeetLabel(heightNum);

  return (
    <motion.div
      key="location"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* Location */}
      <div className="space-y-2">
        <Label
          htmlFor="location"
          className="text-foreground font-body font-medium text-sm tracking-wide flex items-center gap-2"
        >
          <MapPin size={14} className="text-primary" />
          Location
        </Label>
        <Input
          id="location"
          data-ocid="onboard-location"
          value={location}
          onChange={(e) => onChangeLocation(e.target.value)}
          placeholder="e.g. New York, NY"
          className={cn(
            "h-13 rounded-2xl bg-card border-border text-foreground placeholder:text-muted-foreground/50",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-base px-4 py-3.5",
            errors.location && "border-destructive",
          )}
        />
        {errors.location ? (
          <p className="text-xs font-body text-primary/90">{errors.location}</p>
        ) : (
          <p className="text-xs text-muted-foreground/60 font-body">
            Used to show nearby members
          </p>
        )}
      </div>

      {/* Height */}
      <div className="space-y-3">
        <Label
          htmlFor="height"
          className="text-foreground font-body font-medium text-sm tracking-wide flex items-center gap-2"
        >
          <Ruler size={14} className="text-primary" />
          Height
        </Label>
        <div className="bg-card rounded-2xl border border-border p-4 space-y-3">
          <div className="flex items-end justify-between">
            <span className="font-display font-semibold text-2xl text-foreground">
              {heightNum} cm
            </span>
            <span className="text-muted-foreground font-body text-sm">
              {heightLabel}
            </span>
          </div>

          {/* Slider track */}
          <div className="relative">
            <input
              id="height"
              data-ocid="onboard-height"
              type="range"
              min={145}
              max={210}
              step={1}
              value={heightNum}
              onChange={(e) => onChangeHeight(e.target.value)}
              className="w-full h-2 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:gradient-gold [&::-webkit-slider-thumb]:shadow-gold [&::-webkit-slider-thumb]:cursor-grab accent-primary"
              style={{
                background: `linear-gradient(to right, oklch(0.68 0.2 50) 0%, oklch(0.68 0.2 50) ${((heightNum - 145) / (210 - 145)) * 100}%, oklch(0.22 0 0) ${((heightNum - 145) / (210 - 145)) * 100}%, oklch(0.22 0 0) 100%)`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-muted-foreground/50 font-body">
            <span>145cm</span>
            <span>210cm</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
