import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { DiscoveryFilters } from "@/types";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface FiltersDrawerProps {
  open: boolean;
  onClose: () => void;
  filters: DiscoveryFilters;
  onSave: (filters: DiscoveryFilters) => void;
}

const INTERESTS = [
  "Fine Dining",
  "Opera",
  "Vintage Wine",
  "Travel",
  "Contemporary Art",
  "Jazz",
  "French Cuisine",
  "Yoga",
  "Photography",
  "Philanthropy",
  "Pilates",
  "Sustainable Fashion",
  "Hiking",
  "Literature",
  "Tennis",
  "Sailing",
  "Gastronomy",
  "Theater",
  "Architecture",
  "Wellness",
];

const GENDER_OPTIONS = [
  { value: "all", label: "Everyone" },
  { value: "women", label: "Women" },
  { value: "men", label: "Men" },
];

function RangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  label,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onChange: (min: number, max: number) => void;
  label: string;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{label}</span>
        <span className="text-sm text-primary font-semibold">
          {valueMin}–{valueMax}
        </span>
      </div>
      <div className="relative h-1.5 rounded-full bg-muted">
        <div
          className="absolute h-full rounded-full gradient-gold"
          style={{
            left: `${((valueMin - min) / (max - min)) * 100}%`,
            right: `${100 - ((valueMax - min) / (max - min)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMin}
          onChange={(e) =>
            onChange(Math.min(Number(e.target.value), valueMax - 1), valueMax)
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`${label} minimum`}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={valueMax}
          onChange={(e) =>
            onChange(valueMin, Math.max(Number(e.target.value), valueMin + 1))
          }
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label={`${label} maximum`}
        />
        {/* Thumbs */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full gradient-gold border-2 border-background shadow-gold pointer-events-none"
          style={{
            left: `calc(${((valueMin - min) / (max - min)) * 100}% - 10px)`,
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full gradient-gold border-2 border-background shadow-gold pointer-events-none"
          style={{
            left: `calc(${((valueMax - min) / (max - min)) * 100}% - 10px)`,
          }}
        />
      </div>
    </div>
  );
}

export default function FiltersDrawer({
  open,
  onClose,
  filters,
  onSave,
}: FiltersDrawerProps) {
  const [localFilters, setLocalFilters] = useState<DiscoveryFilters>(filters);

  const toggleInterest = (interest: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = () => {
    onSave(localFilters);
    onClose();
  };

  const handleReset = () => {
    setLocalFilters({ minAge: 18, maxAge: 45, maxDistance: 50, interests: [] });
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="bg-card border-t border-border rounded-t-3xl max-h-[88vh] overflow-y-auto p-0"
        data-ocid="filters-drawer"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        <SheetHeader className="px-6 pb-4">
          <SheetTitle className="flex items-center gap-2 font-display text-xl text-foreground">
            <SlidersHorizontal size={18} className="text-primary" />
            Discovery Filters
          </SheetTitle>
        </SheetHeader>

        <div className="px-6 pb-8 space-y-8">
          {/* Age range */}
          <div>
            <RangeSlider
              label="Age Range"
              min={18}
              max={65}
              valueMin={localFilters.minAge}
              valueMax={localFilters.maxAge}
              onChange={(min, max) =>
                setLocalFilters((p) => ({ ...p, minAge: min, maxAge: max }))
              }
            />
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Maximum Distance
              </span>
              <span className="text-sm text-primary font-semibold">
                {localFilters.maxDistance} km
              </span>
            </div>
            <div className="relative h-1.5 rounded-full bg-muted">
              <div
                className="absolute h-full rounded-full gradient-gold left-0"
                style={{
                  right: `${100 - (localFilters.maxDistance / 200) * 100}%`,
                }}
              />
              <input
                type="range"
                min={5}
                max={200}
                value={localFilters.maxDistance}
                onChange={(e) =>
                  setLocalFilters((p) => ({
                    ...p,
                    maxDistance: Number(e.target.value),
                  }))
                }
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Maximum distance"
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full gradient-gold border-2 border-background shadow-gold pointer-events-none"
                style={{
                  left: `calc(${(localFilters.maxDistance / 200) * 100}% - 10px)`,
                }}
              />
            </div>
          </div>

          {/* Gender preference */}
          <div className="space-y-3">
            <span className="text-sm font-medium text-foreground">Show Me</span>
            <div className="flex gap-2">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() =>
                    setLocalFilters((p) => ({ ...p, genderPref: opt.value }))
                  }
                  className={cn(
                    "flex-1 h-10 rounded-xl text-sm font-medium border transition-smooth",
                    localFilters.genderPref === opt.value ||
                      (!localFilters.genderPref && opt.value === "all")
                      ? "gradient-gold border-transparent text-primary-foreground shadow-gold"
                      : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Interests
              </span>
              {localFilters.interests.length > 0 && (
                <span className="text-xs text-primary">
                  {localFilters.interests.length} selected
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((interest) => {
                const active = localFilters.interests.includes(interest);
                return (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    data-ocid={`filter-interest-${interest.toLowerCase().replace(/\s+/g, "-")}`}
                    className={cn(
                      "h-8 px-3 rounded-full text-xs font-medium border transition-smooth",
                      active
                        ? "gradient-gold border-transparent text-primary-foreground shadow-[0_0_12px_oklch(0.68_0.2_50/0.3)]"
                        : "bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40",
                    )}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 px-6 py-4 border-t border-border bg-card flex gap-3">
          <Button
            variant="outline"
            onClick={handleReset}
            className="flex-1 border-border text-muted-foreground hover:text-foreground"
            data-ocid="filters-reset"
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            className="flex-2 gradient-gold border-transparent text-primary-foreground font-semibold shadow-gold hover:opacity-90"
            data-ocid="filters-save"
            style={{ flex: 2 }}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
