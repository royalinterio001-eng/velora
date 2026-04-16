import VerifiedBadge from "@/components/VerifiedBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Match } from "@/types";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { CheckCheck, Star } from "lucide-react";
import { motion } from "motion/react";

interface ConversationItemProps {
  match: Match;
  index?: number;
}

export default function ConversationItem({
  match,
  index = 0,
}: ConversationItemProps) {
  const user = match.matchedUser;
  const hasUnread =
    match.lastMessage &&
    !match.lastMessage.isRead &&
    match.lastMessage.senderId !== "me";
  const isSentByMe = match.lastMessage?.senderId === "me";

  const timeAgo = match.lastMessage
    ? formatDistanceToNow(new Date(match.lastMessage.sentAt), {
        addSuffix: false,
      })
    : formatDistanceToNow(new Date(match.matchedAt), { addSuffix: false });

  // Format to shorter strings
  const shortTime = timeAgo
    .replace(" minutes", "m")
    .replace(" minute", "m")
    .replace(" hours", "h")
    .replace(" hour", "h")
    .replace(" days", "d")
    .replace(" day", "d")
    .replace("about ", "")
    .replace("less than a minute", "now");

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to="/matches/$matchId"
        params={{ matchId: match.id }}
        data-ocid={`conversation-item-${match.id}`}
        className={cn(
          "flex items-center gap-3.5 px-5 py-3.5 transition-smooth border-b border-border/30 last:border-0",
          "hover:bg-card/60 active:bg-card/80",
          hasUnread && "bg-primary/5",
        )}
      >
        {/* Avatar with online/verified indicator */}
        <div className="relative flex-shrink-0">
          <Avatar
            className={cn(
              "w-[54px] h-[54px] transition-smooth",
              match.isNew
                ? "border-2 border-primary shadow-[0_0_12px_oklch(0.68_0.2_50/0.35)]"
                : "border-2 border-border/50",
            )}
          >
            <AvatarImage
              src={user.photos[0]}
              alt={user.name}
              className="object-cover"
            />
            <AvatarFallback className="bg-card text-foreground font-display font-bold">
              {user.name[0]}
            </AvatarFallback>
          </Avatar>
          {user.isPremium && (
            <span className="absolute -bottom-1 -right-1">
              <VerifiedBadge size="sm" />
            </span>
          )}
          {!user.isPremium && match.isNew && (
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full gradient-gold border-2 border-background" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <span
                className={cn(
                  "font-display truncate",
                  hasUnread
                    ? "font-bold text-foreground text-[15px]"
                    : "font-semibold text-foreground text-[14px]",
                )}
              >
                {user.name}
                {user.age ? `, ${user.age}` : ""}
              </span>
              {/* Verified badge inline next to name */}
              {user.isPremium && <VerifiedBadge size="sm" />}
              {/* NEW match badge */}
              {match.isNew && (
                <Badge
                  className="text-[9px] px-1.5 py-0 h-4 font-bold gradient-gold border-0 text-background flex-shrink-0 gap-0.5"
                  data-ocid={`super-like-badge-${match.id}`}
                >
                  <Star size={7} className="fill-background" />
                  NEW
                </Badge>
              )}
            </div>
            <span className="text-[11px] text-muted-foreground flex-shrink-0 font-mono">
              {shortTime}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isSentByMe && match.lastMessage && (
              <CheckCheck
                size={12}
                className={cn(
                  "flex-shrink-0",
                  match.lastMessage.isRead
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              />
            )}
            <p
              className={cn(
                "text-[13px] truncate",
                hasUnread
                  ? "text-foreground font-medium"
                  : "text-muted-foreground font-body",
              )}
            >
              {match.lastMessage
                ? `${isSentByMe ? "You: " : ""}${match.lastMessage.content}`
                : match.isNew
                  ? "✨ You matched! Say hello"
                  : user.occupation}
            </p>
          </div>
        </div>

        {/* Unread dot */}
        {hasUnread && (
          <div className="flex-shrink-0 w-2.5 h-2.5 rounded-full gradient-gold shadow-gold" />
        )}
      </Link>
    </motion.div>
  );
}
