import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";

interface BasicInfoStepProps {
  name: string;
  age: string;
  onChangeName: (val: string) => void;
  onChangeAge: (val: string) => void;
  errors: Record<string, string | undefined>;
}

export default function BasicInfoStep({
  name,
  age,
  onChangeName,
  onChangeAge,
  errors,
}: BasicInfoStepProps) {
  return (
    <motion.div
      key="basic"
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
      className="space-y-6"
    >
      {/* Name */}
      <div className="space-y-2">
        <Label
          htmlFor="name"
          className="text-foreground font-body font-medium text-sm tracking-wide"
        >
          Full Name
        </Label>
        <Input
          id="name"
          data-ocid="onboard-name"
          value={name}
          onChange={(e) => onChangeName(e.target.value)}
          placeholder="Your name"
          className={cn(
            "h-13 rounded-2xl bg-card border-border text-foreground placeholder:text-muted-foreground/50",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-base px-4 py-3.5",
            errors.name && "border-destructive focus:ring-destructive/20",
          )}
        />
        {errors.name && (
          <p className="text-xs font-body text-primary/90 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full gradient-gold inline-block" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label
          htmlFor="age"
          className="text-foreground font-body font-medium text-sm tracking-wide"
        >
          Age
        </Label>
        <Input
          id="age"
          data-ocid="onboard-age"
          type="number"
          value={age}
          onChange={(e) => onChangeAge(e.target.value)}
          placeholder="25"
          min={18}
          max={80}
          className={cn(
            "h-13 rounded-2xl bg-card border-border text-foreground placeholder:text-muted-foreground/50",
            "focus:border-primary focus:ring-2 focus:ring-primary/20 transition-smooth text-base px-4 py-3.5",
            errors.age && "border-destructive focus:ring-destructive/20",
          )}
        />
        {errors.age && (
          <p className="text-xs font-body text-primary/90 flex items-center gap-1">
            <span className="w-1 h-1 rounded-full gradient-gold inline-block" />
            {errors.age}
          </p>
        )}
        <p className="text-xs text-muted-foreground/60 font-body">
          You must be at least 18 years old
        </p>
      </div>
    </motion.div>
  );
}
