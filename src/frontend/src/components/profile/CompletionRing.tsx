interface CompletionRingProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  children?: React.ReactNode;
}

export default function CompletionRing({
  percent,
  size = 112,
  strokeWidth = 4,
  children,
}: CompletionRingProps) {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="oklch(0.25 0 0)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="url(#goldGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.72 0.22 52)" />
            <stop offset="50%" stopColor="oklch(0.68 0.2 50)" />
            <stop offset="100%" stopColor="oklch(0.65 0.2 48)" />
          </linearGradient>
        </defs>
      </svg>
      {/* Content inside ring */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
      {/* Percent badge */}
      <div
        className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full gradient-gold text-[9px] font-bold text-primary-foreground shadow-gold leading-tight whitespace-nowrap"
        aria-label={`Profile ${percent}% complete`}
      >
        {percent}%
      </div>
    </div>
  );
}
