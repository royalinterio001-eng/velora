import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

type Gender = "male" | "female" | "nonbinary" | "other";

interface AboutStepProps {
  gender: Gender | "";
  genderPref: Gender | "";
  bio: string;
  onChangeGender: (val: Gender) => void;
  onChangeGenderPref: (val: Gender) => void;
  onChangeBio: (val: string) => void;
  errors: Record<string, string | undefined>;
}

const GENDER_OPTIONS: { value: Gender; label: string; emoji: string }[] = [
  { value: "male", label: "Man", emoji: "♂" },
  { value: "female", label: "Woman", emoji: "♀" },
  { value: "nonbinary", label: "Non-binary", emoji: "⚧" },
  { value: "other", label: "Other", emoji: "✦" },
];

const PREF_OPTIONS: { value: Gender; label: string }[] = [
  { value: "female", label: "Women" },
  { value: "male", label: "Men" },
  { value: "nonbinary", label: "Non-binary" },
  { value: "other", label: "Everyone" },
];

export default function AboutStep({
  gender,
  genderPref,
  bio,
  onChangeGender,
  onChangeGenderPref,
  onChangeBio,
  errors,
}: AboutStepProps) {
  return (
    <motion.div
      key="about"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* Gender */}
      <div className="space-y-3">
        <Label className="text-foreground font-body font-medium text-sm tracking-wide">
          I am a…
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          {GENDER_OPTIONS.map(({ value, label, emoji }) => (
            <button
              key={value}
              type="button"
              data-ocid={`gender-${value}`}
              onClick={() => onChangeGender(value)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-2xl border transition-smooth text-left",
                gender === value
                  ? "gradient-gold border-transparent text-primary-foreground shadow-gold"
                  : "bg-card border-border text-foreground hover:border-primary/40",
              )}
            >
              <span className="text-lg leading-none">{emoji}</span>
              <span className="font-body text-sm font-medium">{label}</span>
            </button>
          ))}
        </div>
        {errors.gender && (
          <p className="text-xs font-body text-primary/90">{errors.gender}</p>
        )}
      </div>

      {/* Gender preference */}
      <div className="space-y-3">
        <Label className="text-foreground font-body font-medium text-sm tracking-wide">
          Interested in…
        </Label>
        <div className="grid grid-cols-2 gap-2.5">
          {PREF_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              data-ocid={`pref-${value}`}
              onClick={() => onChangeGenderPref(value)}
              className={cn(
                "px-4 py-3 rounded-2xl border transition-smooth text-center font-body text-sm font-medium",
                genderPref === value
                  ? "gradient-gold border-transparent text-primary-foreground shadow-gold"
                  : "bg-card border-border text-foreground hover:border-primary/40",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {errors.genderPref && (
          <p className="text-xs font-body text-primary/90">
            {errors.genderPref}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label
            htmlFor="bio"
            className="text-foreground font-body font-medium text-sm tracking-wide"
          >
            About Me
          </Label>
          <span className="text-xs text-muted-foreground font-body">
            {bio.length}/300
          </span>
        </div>
        <Textarea
          id="bio"
          data-ocid="onboard-bio"
          value={bio}
          onChange={(e) => onChangeBio(e.target.value.slice(0, 300))}
          placeholder="Share what makes you extraordinary — your passions, values, what you're looking for…"
          rows={4}
          className={cn(
            "rounded-2xl bg-card border-border text-foreground placeholder:text-muted-foreground/50",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth resize-none text-base",
            errors.bio && "border-destructive",
          )}
        />
        {errors.bio && (
          <p className="text-xs font-body text-primary/90">{errors.bio}</p>
        )}
      </div>
    </motion.div>
  );
}
