import { cn } from "@/lib/utils";
import { Send, Smile } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";

const MAX_CHARS = 500;

const EMOJI_LIST = ["❤️", "😍", "✨", "🔥", "😘", "💫", "🥂", "🌹"];

interface MessageInputProps {
  onSend: (text: string) => void;
  isPending?: boolean;
  disabled?: boolean;
}

export default function MessageInput({
  onSend,
  isPending = false,
  disabled = false,
}: MessageInputProps) {
  const [draft, setDraft] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const remaining = MAX_CHARS - draft.length;
  const isNearLimit = remaining <= 50;
  const isOverLimit = remaining < 0;
  const canSend =
    draft.trim().length > 0 && !isOverLimit && !isPending && !disabled;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSend) handleSend();
    }
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || isOverLimit) return;
    onSend(text);
    setDraft("");
    setShowEmojis(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleEmojiPick = (emoji: string) => {
    if (draft.length < MAX_CHARS) {
      setDraft((prev) => prev + emoji);
      textareaRef.current?.focus();
    }
  };

  return (
    <div className="flex flex-col bg-card border-t border-border/60">
      {/* Emoji tray */}
      {showEmojis && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex gap-2 px-4 pt-3 pb-1 overflow-x-auto scrollbar-none"
        >
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => handleEmojiPick(emoji)}
              className="text-xl hover:scale-125 transition-smooth flex-shrink-0 action-btn"
              aria-label={`Insert ${emoji}`}
            >
              {emoji}
            </button>
          ))}
        </motion.div>
      )}

      <div className="flex items-end gap-2 px-4 py-3">
        {/* Emoji button */}
        <button
          type="button"
          data-ocid="chat-emoji-btn"
          onClick={() => setShowEmojis((v) => !v)}
          className={cn(
            "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-smooth mb-0.5",
            showEmojis
              ? "bg-primary/20 text-primary"
              : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80",
          )}
          aria-label="Toggle emoji picker"
        >
          <Smile size={18} />
        </button>

        {/* Textarea */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            data-ocid="chat-input"
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Write something thoughtful..."
            rows={1}
            maxLength={MAX_CHARS + 20}
            disabled={disabled}
            className={cn(
              "w-full resize-none rounded-2xl px-4 py-2.5",
              "bg-background border border-border/60",
              "text-foreground text-[14px] font-body leading-relaxed",
              "placeholder:text-muted-foreground/60",
              "focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30",
              "transition-smooth disabled:opacity-50",
              "min-h-[42px] max-h-[120px] overflow-y-auto",
              isOverLimit && "border-destructive/60 focus:border-destructive",
            )}
            style={{ scrollbarWidth: "none" }}
          />
          {/* Character counter */}
          {isNearLimit && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "absolute bottom-2 right-3 text-[10px] font-mono font-bold",
                isOverLimit ? "text-destructive" : "text-muted-foreground",
              )}
            >
              {remaining}
            </motion.span>
          )}
        </div>

        {/* Send button */}
        <motion.button
          type="button"
          data-ocid="chat-send"
          onClick={handleSend}
          disabled={!canSend}
          whileTap={{ scale: 0.9 }}
          className={cn(
            "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-smooth mb-0.5",
            canSend
              ? "gradient-gold shadow-gold text-background action-btn"
              : "bg-muted text-muted-foreground cursor-not-allowed",
          )}
          aria-label="Send message"
        >
          <Send size={16} strokeWidth={2.5} />
        </motion.button>
      </div>
    </div>
  );
}
