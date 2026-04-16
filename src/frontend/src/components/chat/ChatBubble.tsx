import { cn } from "@/lib/utils";
import type { Message } from "@/types";
import { format } from "date-fns";
import { CheckCheck } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface ChatBubbleProps {
  message: Message;
  isMe: boolean;
  showTimestamp?: boolean;
  isLastInCluster?: boolean;
}

export default function ChatBubble({
  message,
  isMe,
  showTimestamp = false,
  isLastInCluster = false,
}: ChatBubbleProps) {
  const [pressed, setPressed] = useState(false);
  const timeString = format(new Date(message.sentAt), "h:mm a");

  return (
    <div
      className={cn(
        "flex flex-col gap-0.5",
        isMe ? "items-end" : "items-start",
      )}
    >
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className={cn("flex", isMe ? "justify-end" : "justify-start")}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onMouseLeave={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
      >
        <div
          data-ocid={`msg-${message.id}`}
          className={cn(
            "relative max-w-[78%] px-4 py-2.5 font-body text-[14px] leading-relaxed cursor-default select-text",
            "transition-all duration-150",
            pressed && "scale-95",
            isMe
              ? [
                  "text-background font-medium",
                  "rounded-2xl rounded-br-[6px]",
                  "gradient-gold",
                  "shadow-[0_4px_16px_oklch(0.68_0.2_50/0.35)]",
                ]
              : [
                  "text-foreground",
                  "rounded-2xl rounded-bl-[6px]",
                  "bg-card border border-border/60",
                  "shadow-[0_2px_8px_oklch(0_0_0/0.25)]",
                ],
          )}
        >
          {message.content}

          {/* Timestamp on press or when showTimestamp */}
          {(pressed || showTimestamp) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                "absolute -bottom-5 text-[10px] text-muted-foreground whitespace-nowrap",
                isMe ? "right-0" : "left-0",
              )}
            >
              {timeString}
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Read receipt + timestamp for last sent message in cluster */}
      {isMe && isLastInCluster && (
        <div className="flex items-center gap-1 pr-1">
          <CheckCheck
            size={12}
            className={cn(
              "transition-smooth",
              message.isRead
                ? "text-primary drop-shadow-[0_0_4px_oklch(0.68_0.2_50/0.6)]"
                : "text-muted-foreground/50",
            )}
          />
          {message.isRead && (
            <span className="text-[10px] text-primary/70">Seen</span>
          )}
        </div>
      )}

      {/* Time separator — shown between clusters */}
      {showTimestamp && !pressed && (
        <div
          className={cn(
            "text-[11px] text-muted-foreground/60 mt-0.5",
            isMe ? "pr-1" : "pl-1",
          )}
        >
          {timeString}
        </div>
      )}
    </div>
  );
}
